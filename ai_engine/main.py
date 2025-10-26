import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.model import *
from utils.PreProcess import *
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
import numpy as np

app = Flask(__name__)
CORS(app)

STORE_DATA = 'data'
os.mkdir(STORE_DATA) if not os.path.exists(STORE_DATA) else None

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    file_path = os.path.join(STORE_DATA, "dataset.csv")
    file.save(file_path)

    return jsonify({'message': f'File {file.filename} uploaded successfully'}), 200

@app.route('/train', methods=['GET'])
def trainer():
    try:
        # get file path
        files = os.listdir(STORE_DATA)
        if not files:
            return jsonify({'error': 'No dataset found. Please upload first.'}), 400
        
        file_path = os.path.join(STORE_DATA, files[0])

        # check file type
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
        elif file_path.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(file_path)
        else:
            return jsonify({
                'message': '⚙️ Non-tabular file detected. Reserved for LLM / Deep Learning pipeline (coming soon).'
            }), 202

        # identify problem type
        _, target_model = identify_problem_type(df)

        # PreProcess data
        df_clean = df.copy()

        # drop exact duplicate rows
        # df_clean = df_clean.drop_duplicates().reset_index(drop=True)

        # # drop constant features
        # const_feats = constant_features(df_clean)
        # if const_feats:
        #     df_clean = df_clean.drop(columns=const_feats, errors='ignore')

        # # coerce numeric-like columns to numeric, drop rows that cannot be coerced
        # for col in df_clean.columns:
        #     if df_clean[col].dtype == object:
        #         coerced = pd.to_numeric(df_clean[col], errors='coerce')
        #         # if coercion converts many values to numbers, keep numeric version
        #         if coerced.notna().sum() / len(coerced) > 0.6:
        #             df_clean[col] = coerced
        # # drop rows with non-coercible numeric fields (keeping rows with NaNs handled later)
        # # Note: we do not drop rows here aggressively; we'll impute below.

        # # handle missing values: drop columns with >50% missing, else impute median for numeric and mode for categorical
        # miss_ratio = df_clean.isnull().mean()
        # drop_cols = miss_ratio[miss_ratio > 0.5].index.tolist()
        # if drop_cols:
        #     df_clean = df_clean.drop(columns=drop_cols)

        # for col in df_clean.columns:
        #     if df_clean[col].isnull().any():
        #         if pd.api.types.is_numeric_dtype(df_clean[col]):
        #             median = df_clean[col].median()
        #             df_clean[col] = df_clean[col].fillna(median)
        #         else:
        #             mode = df_clean[col].mode()
        #             df_clean[col] = df_clean[col].fillna(mode[0] if len(mode) > 0 else "")

        # ensure target is present
        target_col = df_clean.columns[-1]
        # basic encoding for target if classification
        if target_model == 'classification':
            le = LabelEncoder()
            try:
                y_encoded = le.fit_transform(df_clean[target_col].astype(str))
            except Exception:
                y_encoded = df_clean[target_col]
        else:
            # for regression, coerce to numeric
            df_clean[target_col] = pd.to_numeric(df_clean[target_col], errors='coerce')
            if df_clean[target_col].isnull().any():
                # drop rows with invalid target
                df_clean = df_clean.dropna(subset=[target_col])

        # separate features and target
        X = df_clean.drop(columns=[target_col])
        y = y_encoded if target_model == 'classification' else df_clean[target_col]

        # encode categorical features
        cat_cols = X.select_dtypes(include=['object', 'category']).columns.tolist()
        if cat_cols:
            X = pd.get_dummies(X, columns=cat_cols, drop_first=True)

        # drop highly correlated features (multicollinearity)
        try:
            high_corr = high_correlation(X.select_dtypes(include=[np.number]), threshold=0.95)
            if high_corr:
                X = X.drop(columns=high_corr, errors='ignore')
        except Exception:
            # if correlation computation fails, continue without dropping
            pass

        # feature scaling for numeric columns
        num_cols = X.select_dtypes(include=[np.number]).columns.tolist()
        if num_cols:
            scaler = StandardScaler()
            X[num_cols] = scaler.fit_transform(X[num_cols])

        # final check: align X and y lengths after any row drops
        X = X.reset_index(drop=True)
        y = pd.Series(y).reset_index(drop=True)

        # split
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # train appropriate model
        if target_model == 'classification':
            message = train_best_classification_model(X_train, X_test, y_train, y_test)
            model_name = 'best_classification_model.pkl'
        else:
            message = train_best_regression_model(X_train, X_test, y_train, y_test)
            model_name = 'best_regression_model.pkl'

        return jsonify({'message': message, 'model': model_name}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)