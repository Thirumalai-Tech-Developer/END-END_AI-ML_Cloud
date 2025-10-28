import dotenv
import google.generativeai as genai
from transformers import AutoModelForCausalLM, AutoTokenizer

class LocalLM:
    def __init__(self, model_name: str = 'HuggingFaceTB/SmolLM2-135M-Instruct'):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(model_name)

    def generate_response(self, prompt: str) -> str:
        inputs = self.tokenizer(prompt, return_tensors='pt')
        outputs = self.model.generate(**inputs, max_length=1024)
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return response
    
    def chat(self, messages: list) -> str:
        conversation = ""
        for message in messages:
            role = message['role']
            content = message['content']
            conversation += f"{role}: {content}\n"
        conversation += "assistant: "
        return self.generate_response(conversation)
    
class GeminiLLM:
    def __init__(self, model_name: str = "gemma-3-27b-it"):
        api_key = dotenv.get_key(dotenv.find_dotenv(), "GEMINI_API")
        if not api_key:
            raise ValueError("GEMINI_API not found in .env file")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(model_name)

    def generate_response(self, prompt: str) -> str:
        response = self.model.generate_content(
            prompt
        )
        return response.text
    
    def chat(self, messages: list) -> str:
        prompt = ""
        for message in messages:
            role = message['role']
            content = message['content']
            prompt += f"{role}: {content}\n"
            
        response = self.model.generate_content(
            prompt
        )

        return response.text