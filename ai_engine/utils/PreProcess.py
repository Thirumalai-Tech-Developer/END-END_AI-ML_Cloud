import pandas as pd
import numpy as np
from scipy.stats import skew, kurtosis

def missing_values(data):
    clean_data = data.copy()
    for col in clean_data.columns:
        # if column is numeric but has some string values
        if clean_data[col].dtype != 'object':
            invalid_mask = pd.to_numeric(clean_data[col], errors='coerce').isna() & clean_data[col].notna()
            if invalid_mask.any():
                clean_data = clean_data[~invalid_mask]
    clean_data.reset_index(drop=True, inplace=True)
    return clean_data.isnull().sum()

def duplicate_rows(data):
    return data[data.duplicated()]

def outliers(data, column):
    Q1 = data[column].quantile(0.25)
    Q3 = data[column].quantile(0.75)
    IQR = Q3 - Q1
    lower = Q1 - 1.5 * IQR
    upper = Q3 + 1.5 * IQR
    return data[(data[column] < lower) | (data[column] > upper)]

def skewness(data, column):
    return skew(data[column].dropna())

def kurtosis_value(data, column):
    return kurtosis(data[column].dropna())

def data_imbalance(data, target_column):
    return data[target_column].value_counts(normalize=True)

def constant_features(data):
    return [col for col in data.columns if data[col].nunique() == 1]

def high_correlation(data, threshold=0.9):
    corr_matrix = data.corr().abs()
    upper = corr_matrix.where(np.triu(np.ones(corr_matrix.shape), k=1).astype(bool))
    return [column for column in upper.columns if any(upper[column] > threshold)]

def feature_scaling_test(data):
    desc = data.describe()
    return desc.loc[['min', 'max']]

def normalization_test(data):
    normalized = (data - data.min()) / (data.max() - data.min())
    return normalized.describe().loc[['min', 'max']]

def encoding_check(data):
    return data.select_dtypes(include=['object']).columns.tolist()

def feature_importance_test(data, target_column):
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.preprocessing import LabelEncoder
    X = data.drop(columns=[target_column])
    y = LabelEncoder().fit_transform(data[target_column])
    X = pd.get_dummies(X, drop_first=True)
    model = RandomForestClassifier()
    model.fit(X, y)
    return dict(zip(X.columns, model.feature_importances_))

def null_ratio_test(data):
    return (data.isnull().sum() / len(data)) * 100

def unique_value_check(data):
    return data.nunique()

def datatype_check(data):
    return data.dtypes

def multicollinearity_test(data):
    from statsmodels.stats.outliers_influence import variance_inflation_factor
    X = pd.get_dummies(data, drop_first=True)
    vif_data = pd.DataFrame()
    vif_data["feature"] = X.columns
    vif_data["VIF"] = [variance_inflation_factor(X.values, i) for i in range(X.shape[1])]
    return vif_data.sort_values(by="VIF", ascending=False)

def variance_test(data):
    return data.var()

def outlier_influence_test(data, target_column):
    from sklearn.linear_model import LinearRegression
    X = data.drop(columns=[target_column])
    y = data[target_column]
    model = LinearRegression()
    model.fit(X, y)
    influence = np.abs(model.coef_)
    return dict(zip(X.columns, influence))

def missing_value_pattern(data):
    return data.isnull().astype(int).corr()

def noise_detection_test(data, column):
    mean = data[column].mean()
    std = data[column].std()
    return data[(np.abs(data[column] - mean) > 3 * std)]
