import os
import dotenv
dotenv.load_dotenv()
from typing import List, Union
from pathlib import Path
import google.generativeai as genai

# ✅ Updated imports for 2025 LangChain versions
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import TextLoader, PyPDFLoader, UnstructuredFileLoader


class RAGProcessor:
    def __init__(
        self,
        model_name: str = "sentence-transformers/all-MiniLM-L6-v2",
        gemini_model: str = "gemma-3-27b-it"
    ):
        self.embeddings = HuggingFaceEmbeddings(model_name=model_name)
        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        self.gemini_model = gemini_model

        api_key = dotenv.get_key(dotenv.find_dotenv(), "GEMINI_API")
        if not api_key:
            raise ValueError("GEMINI_API not found in .env file")
        genai.configure(api_key=api_key)

    def load_document(self, file_path: Union[str, Path]) -> List[Document]:
        file_path = str(file_path)
        file_extension = os.path.splitext(file_path)[1].lower()

        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        if file_extension == '.txt':
            loader = TextLoader(file_path)
        elif file_extension == '.pdf':
            loader = PyPDFLoader(file_path)
        else:
            loader = UnstructuredFileLoader(file_path)

        documents = loader.load()
        split_docs = self.text_splitter.split_documents(documents)
        return split_docs

    def create_vector_store(self, documents: List[Document], persist_directory: str = None) -> Chroma:
        vectorstore = Chroma.from_documents(
            documents=documents,
            embedding=self.embeddings,
            persist_directory=persist_directory
        )
        if persist_directory:
            vectorstore.persist()
        return vectorstore

    def query_similar_docs(self, vectorstore: Chroma, query: str, k: int = 4) -> List[Document]:
        return vectorstore.similarity_search(query, k=k)

    def generate_answer(self, vectorstore: Chroma, query: str, k: int = 4) -> str:
        similar_docs = self.query_similar_docs(vectorstore, query, k)
        context = "\n\n".join([doc.page_content for doc in similar_docs])

        prompt = f"""
        You are an AI assistant using RAG (Retrieval-Augmented Generation).
        Use the following context to answer truthfully.
        Don't hallucinate or guess if the info isn't found.

        Context:
        {context}

        Question:
        {query}

        Answer:
        """

        model = genai.GenerativeModel(self.gemini_model)
        response = model.generate_content(prompt)
        return response.text.strip()
