import os
import shutil
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
GRAPH_PATH = 'graphs'
IS_CLASSIFICTION = False
NEED_CLEANING = True
NEED_SCALING = True
NEED_SKEWNESS_HANDLING = True
TARGET_COLUMN = ''
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

    
    if os.path.exists(GRAPH_PATH):
        shutil.rmtree(GRAPH_PATH)
    os.mkdir(GRAPH_PATH)

    return jsonify({'message': f'File {file.filename} uploaded successfully'}), 200

@app.route('/data', methods=['POST'])
def save_data():
    
    try:
        data = request.get_json()
        global NEED_CLEANING, NEED_SKEWNESS_HANDLING, NEED_SCALING, IS_CLASSIFICTION, TARGET_COLUMN
        NEED_CLEANING = data.get('cleanData', True)
        NEED_SKEWNESS_HANDLING = data.get('skewnessHandled', True)
        NEED_SCALING = data.get('scalingDone', True)
        IS_CLASSIFICTION = data.get('classification', False)
        TARGET_COLUMN = data.get('targetColumn', '')

        return jsonify({'message': '⚙️ Preprocessing options saved successfully.'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/train', methods=['GET', 'POST'])
def trainer():
    try:
        import warnings
        warnings.filterwarnings("ignore", category=UserWarning)

        global NEED_CLEANING, NEED_SKEWNESS_HANDLING, NEED_SCALING, IS_CLASSIFICTION, TARGET_COLUMN

        files = os.listdir(STORE_DATA)
        if not files:
            return jsonify({'error': 'No dataset found. Please upload first.'}), 400
        
        file_path = os.path.join(STORE_DATA, files[0])

        # load file
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
        elif file_path.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(file_path)
        else:
            return jsonify({'message': '⚙️ Non-tabular file detected. Reserved for Deep Learning, LLM or RAG.'}), 202

        target_model = 'classification' if IS_CLASSIFICTION else 'regression'

        # ---------------- CLEANING ----------------
        if NEED_CLEANING:
            df = df.drop_duplicates().reset_index(drop=True)
            miss_ratio = df.isnull().mean()
            drop_cols = miss_ratio[miss_ratio > 0.5].index.tolist()
            if drop_cols:
                df = df.drop(columns=drop_cols)
            for col in df.columns:
                if df[col].isnull().any():
                    if pd.api.types.is_numeric_dtype(df[col]):
                        df[col] = df[col].fillna(df[col].median())
                    else:
                        mode = df[col].mode()
                        df[col] = df[col].fillna(mode[0] if len(mode) > 0 else "")

        # ---------------- TARGET ----------------
        target_col = TARGET_COLUMN if TARGET_COLUMN in df.columns else df.columns[-1]
        y = df[target_col]

        unique_ratio = y.nunique() / len(y)
        if target_model == 'classification' and unique_ratio > 0.5:
            print("⚠️ Auto-corrected: too many unique values, switching to regression.")
            target_model = 'regression'

        if target_model == 'classification':
            le = LabelEncoder()
            y_encoded = le.fit_transform(y.astype(str))
            y = y_encoded
        else:
            y = pd.to_numeric(y, errors='coerce')
            df = df.dropna(subset=[target_col])

        # ---------------- FEATURES ----------------
        X = df.drop(columns=[target_col])
        X = pd.get_dummies(X, drop_first=True)

        # ---------------- SKEWNESS & OUTLIERS ----------------
        if NEED_SKEWNESS_HANDLING:
            import matplotlib.pyplot as plt
            import seaborn as sns
            outlier_dir = GRAPH_PATH
            os.makedirs(outlier_dir, exist_ok=True)

            numeric_cols = X.select_dtypes(include=[np.number]).columns.tolist()
            for i, col in enumerate(numeric_cols, start=1):
                plt.figure(figsize=(6, 4))
                sns.histplot(X[col], kde=True, color='orange', bins=30)
                plt.title(f"{col} | Skew: {X[col].skew():.2f}")
                plt.tight_layout()
                out_path = os.path.join(outlier_dir, f"{i}.jpg")
                plt.savefig(out_path)
                plt.close()

                # Handle skew > 1 (positive) or < -1 (negative)
                skew_val = X[col].skew()
                if abs(skew_val) > 1:
                    X[col] = np.log1p(X[col] - X[col].min() + 1)

        # ---------------- SCALING ----------------
        if NEED_SCALING:
            num_cols = X.select_dtypes(include=[np.number]).columns
            X[num_cols] = StandardScaler().fit_transform(X[num_cols])

        # ---------------- SPLIT & TRAIN ----------------
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        if target_model == 'classification':
            message = train_best_classification_model(X_train, X_test, y_train, y_test)
            model_name = 'best_classification_model.pkl'
        else:
            message = train_best_regression_model(X_train, X_test, y_train, y_test)
            model_name = 'best_regression_model.pkl'

        # ---------------- RETURN ----------------
        return jsonify({
            'message': message,
            'model': model_name,
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/columns', methods=['GET'])
def get_columns():

    files = os.listdir(STORE_DATA)
    if not files:
        return jsonify({'error': 'No dataset found'}), 400
    path = os.path.join(STORE_DATA, files[0])
    df = pd.read_csv(path)
    return jsonify({'columns': df.columns.tolist()}), 200

@app.route('/graph', methods=['GET'])
def get_graphs():
    import os
    folder = 'graphs'
    if not os.path.exists(folder):
        return jsonify({'images': []})
    images = sorted(os.listdir(folder))
    return jsonify({'images': images})

@app.route('/graph/<filename>')
def serve_graph(filename):
    from flask import send_from_directory
    return send_from_directory('graphs', filename)


if __name__ == '__main__':
    app.run(debug=True, port=5000)