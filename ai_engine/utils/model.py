import pickle
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, r2_score
from sklearn.datasets import load_iris, load_diabetes
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.svm import SVC, SVR

def train_best_classification_model():
    data = load_iris()
    X, y = data.data, data.target
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    models = {
        "RandomForest": RandomForestClassifier(),
        "GradientBoosting": GradientBoostingClassifier(),
        "SVM": SVC(),
        "LogisticRegression": LogisticRegression(max_iter=1000)
    }

    best_model, best_acc = None, 0
    for name, model in models.items():
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        acc = accuracy_score(y_test, preds)
        print(f"{name} Accuracy: {acc:.4f}")
        if acc > best_acc:
            best_model, best_acc = model, acc

    with open("best_classification_model.pkl", "wb") as f:
        pickle.dump(best_model, f)

    print(f"\n✅ Best Classification Model saved as best_classification_model.pkl with Accuracy: {best_acc:.4f}")

def train_best_regression_model():
    data = load_diabetes()
    X, y = data.data, data.target
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    models = {
        "RandomForest": RandomForestRegressor(),
        "GradientBoosting": GradientBoostingRegressor(),
        "SVR": SVR(),
        "LinearRegression": LinearRegression()
    }

    best_model, best_score = None, -999
    for name, model in models.items():
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        score = r2_score(y_test, preds)
        print(f"{name} R² Score: {score:.4f}")
        if score > best_score:
            best_model, best_score = model, score

    with open("best_regression_model.pkl", "wb") as f:
        pickle.dump(best_model, f)

    print(f"\n✅ Best Regression Model saved as best_regression_model.pkl with R² Score: {best_score:.4f}")

if __name__ == "__main__":
    print("Training Classification Models...")
    train_best_classification_model()
    print("\nTraining Regression Models...")
    train_best_regression_model()
