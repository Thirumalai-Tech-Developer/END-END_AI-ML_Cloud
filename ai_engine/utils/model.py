import pickle
import os
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import accuracy_score, r2_score
from sklearn.ensemble import (
    RandomForestClassifier, GradientBoostingClassifier, 
    RandomForestRegressor, GradientBoostingRegressor
)
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.svm import SVC, SVR

os.makedirs("graphs", exist_ok=True)

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
    model_scores = {}

    for name, (model, params) in models.items():
        print(f"\n🔍 Training {name}...")
        grid = GridSearchCV(model, params, cv=3, scoring='accuracy', n_jobs=-1, return_train_score=True)
        grid.fit(X_train, y_train)

        results = pd.DataFrame(grid.cv_results_)
        preds = grid.predict(X_test)
        acc = accuracy_score(y_test, preds)
        model_scores[name] = acc
        print(f"{name} Best Params: {grid.best_params_} | Accuracy: {acc:.4f}")

        # --- plot each model performance ---
        plt.figure(figsize=(8, 5))
        plt.plot(range(len(results['mean_test_score'])), results['mean_test_score'], color='orange', marker='o')
        plt.title(f"{name} Hyperparameter Performance")
        plt.xlabel("Parameter Combination Index")
        plt.ylabel("Accuracy")
        plt.grid(True)
        plt.tight_layout()
        plt.savefig(f"graphs/{name}_performance.jpg")
        plt.close()

        if acc > best_acc:
            best_model, best_acc, best_name = grid.best_estimator_, acc, name

    # --- combined comparison plot ---
    plt.figure(figsize=(8, 5))
    plt.bar(model_scores.keys(), model_scores.values(), color=['orange', 'green', 'blue', 'red'])
    plt.title("Classification Model Comparison")
    plt.ylabel("Accuracy")
    plt.xlabel("Models")
    plt.tight_layout()
    plt.savefig("graphs/Classification_Comparison.jpg")
    plt.close()

    with open("best_classification_model.pkl", "wb") as f:
        pickle.dump(best_model, f)

    return f"\n✅ Best Classification Model saved with Accuracy: {best_acc:.4f}", best_name


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
        "LinearRegression": (LinearRegression(), {})
    }

    best_model, best_score = None, -999
    model_scores = {}

    for name, (model, params) in models.items():
        print(f"\n🔍 Training {name}...")
        if params:
            grid = GridSearchCV(model, params, cv=3, scoring='r2', n_jobs=-1, return_train_score=True)
            grid.fit(X_train, y_train)
            preds = grid.predict(X_test)
            score = r2_score(y_test, preds)
            model_scores[name] = score
            results = pd.DataFrame(grid.cv_results_)

            # plot per-model performance
            plt.figure(figsize=(8, 5))
            plt.plot(range(len(results['mean_test_score'])), results['mean_test_score'], color='blue', marker='o')
            plt.title(f"{name} Hyperparameter Performance")
            plt.xlabel("Parameter Combination Index")
            plt.ylabel("R² Score")
            plt.grid(True)
            plt.tight_layout()
            plt.savefig(f"graphs/{name}_performance.jpg")
            plt.close()

            estimator = grid.best_estimator_
        else:
            model.fit(X_train, y_train)
            preds = model.predict(X_test)
            score = r2_score(y_test, preds)
            model_scores[name] = score
            estimator = model

        print(f"{name} R² Score: {score:.4f}")

        if score > best_score:
            best_model, best_score, best_name = estimator, score, name

    # combined comparison
    plt.figure(figsize=(8, 5))
    plt.bar(model_scores.keys(), model_scores.values(), color=['orange', 'green', 'blue', 'red'])
    plt.title("Regression Model Comparison")
    plt.ylabel("R² Score")
    plt.xlabel("Models")
    plt.tight_layout()
    plt.savefig("graphs/Regression_Comparison.jpg")
    plt.close()

    with open("best_regression_model.pkl", "wb") as f:
        pickle.dump(best_model, f)

    return f"\n✅ Best Regression Model saved with R² Score: {best_score:.4f}", best_name
