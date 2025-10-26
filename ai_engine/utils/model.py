import pickle
import pandas as pd
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import accuracy_score, r2_score
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.svm import SVC, SVR

def train_best_classification_model(X_train, X_test, y_train, y_test):

    models = {
        "RandomForest": (RandomForestClassifier(), {
            "n_estimators": [50, 100, 200],
            "max_depth": [None, 5, 10],
            "min_samples_split": [2, 5]
        }),
        "GradientBoosting": (GradientBoostingClassifier(), {
            "n_estimators": [50, 100],
            "learning_rate": [0.01, 0.1],
            "max_depth": [3, 5]
        }),
        "SVM": (SVC(), {
            "C": [0.1, 1, 10],
            "kernel": ["linear", "rbf"],
            "gamma": ["scale", "auto"]
        }),
        "LogisticRegression": (LogisticRegression(max_iter=1000), {
            "C": [0.01, 0.1, 1, 10],
            "penalty": ["l2"],
            "solver": ["lbfgs"]
        })
    }

    best_model, best_acc = None, 0
    for name, (model, params) in models.items():
        grid = GridSearchCV(model, params, cv=3, scoring='accuracy', n_jobs=-1)
        grid.fit(X_train, y_train)
        preds = grid.predict(X_test)
        acc = accuracy_score(y_test, preds)
        print(f"{name} Best Params: {grid.best_params_} | Accuracy: {acc:.4f}")
        if acc > best_acc:
            best_model, best_acc = grid.best_estimator_, acc

    with open("best_classification_model.pkl", "wb") as f:
        pickle.dump(best_model, f)

    return f"\n✅ Best Classification Model saved as best_classification_model.pkl with Accuracy: {best_acc:.4f}"


def train_best_regression_model(X_train, X_test, y_train, y_test):

    models = {
        "RandomForest": (RandomForestRegressor(), {
            "n_estimators": [50, 100, 200],
            "max_depth": [None, 5, 10],
            "min_samples_split": [2, 5]
        }),
        "GradientBoosting": (GradientBoostingRegressor(), {
            "n_estimators": [50, 100],
            "learning_rate": [0.01, 0.1],
            "max_depth": [3, 5]
        }),
        "SVR": (SVR(), {
            "C": [0.1, 1, 10],
            "kernel": ["linear", "rbf"],
            "gamma": ["scale", "auto"]
        }),
        "LinearRegression": (LinearRegression(), {
            # LinearRegression has almost no hyperparameters to tune
        })
    }

    best_model, best_score = None, -999
    for name, (model, params) in models.items():
        if params:
            grid = GridSearchCV(model, params, cv=3, scoring='r2', n_jobs=-1)
            grid.fit(X_train, y_train)
            preds = grid.predict(X_test)
            score = r2_score(y_test, preds)
            print(f"{name} Best Params: {grid.best_params_} | R² Score: {score:.4f}")
            estimator = grid.best_estimator_
        else:
            # No hyperparameters to tune
            model.fit(X_train, y_train)
            preds = model.predict(X_test)
            score = r2_score(y_test, preds)
            print(f"{name} R² Score: {score:.4f}")
            estimator = model

        if score > best_score:
            best_model, best_score = estimator, score

    with open("best_regression_model.pkl", "wb") as f:
        pickle.dump(best_model, f)

    return f"\n✅ Best Regression Model saved as best_regression_model.pkl with R² Score: {best_score:.4f}"
