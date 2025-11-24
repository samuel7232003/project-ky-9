# from google import genai
#
# client = genai.Client(api_key="AIzaSyD-5Ze_JHT9QJh30vFHcnITYD05L8mA6sw")
#
# response = client.models.generate_content(
#     model="gemini-2.5-flash", contents="bạn có thể trả lời bằng tiếng việt được ko"
# )
# print(response.text)

# download model embedding

from sentence_transformers import SentenceTransformer
sentences = ["This is an example sentence", "Each sentence is converted"]

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
embeddings = model.encode(sentences)
print(embeddings)

