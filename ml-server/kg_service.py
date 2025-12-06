import os
import re
from py2neo import Graph
import google.generativeai as genai_emb
from google import genai
from ratelimit import limits, sleep_and_retry
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Neo4j connection
NEO4J_URI = os.getenv('NEO4J_URI', 'neo4j+s://f3d83d5c.databases.neo4j.io')
NEO4J_USER = os.getenv('NEO4J_USER', 'neo4j')
NEO4J_PASSWORD = os.getenv('NEO4J_PASSWORD', 'OdsKm9O5_yCws_0pxLaWZjVlzQNjElSg4Lc9ti25Q8s')

# Gemini API key
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyDlb9z3HXkODdXU6NQOuQkUSgvMSQugRh8')

# Initialize connections
graph = None
genai_emb.configure(api_key=GEMINI_API_KEY)

def get_graph():
    """Get or create Neo4j graph connection"""
    global graph
    if graph is None:
        graph = Graph(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    return graph

@sleep_and_retry
@limits(calls=1500, period=60)
def get_embedding(text):
    """Get embedding for text using Gemini API"""
    try:
        result = genai_emb.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_document",
        )
        return result['embedding']
    except Exception as e:
        print(f"Embedding error: {e}")
        return None

def semantic_search(node_label, text_field, embedding_field, query_text, top_k=5):
    """
    Semantic search in Neo4j using embeddings
    
    Args:
        node_label: label của node (Benh, TrieuChung...)
        text_field: trường chứa text gốc (name hoặc desc)
        embedding_field: trường chứa embedding đã lưu
        query_text: text người dùng muốn tìm
        top_k: số lượng kết quả trả về
    
    Returns:
        List of results with similarity scores
    """
    graph = get_graph()
    
    # 1. Lấy embedding cho câu query
    query_emb = get_embedding(query_text)
    if query_emb is None:
        print("Cannot get query embedding.")
        return []

    print(f"Query embedding length: {len(query_emb)}")

    # 2. Truy vấn tính cosine similarity trong Neo4j
    results = graph.run(f"""
    MATCH (n:{node_label})
    WHERE n.{embedding_field} IS NOT NULL

    WITH n,
        reduce( dot = 0.0, i in range(0, size(n.{embedding_field})-1) |
            dot + n.{embedding_field}[i] * $embedding[i]
        ) /
        (
            sqrt(reduce(a = 0.0, i in range(0, size(n.{embedding_field})-1) |
                a + n.{embedding_field}[i] * n.{embedding_field}[i]
            )) *
            sqrt(reduce(b = 0.0, i in range(0, size($embedding)-1) |
                b + $embedding[i] * $embedding[i]
            ))
        ) AS similarity

    WHERE similarity > 0
    RETURN
        n.cay AS cay,
        n.benh AS benh,
        n.description AS description,
        n.{text_field} AS text,
        similarity AS score
    ORDER BY similarity DESC
    LIMIT $top_k
    """, parameters={
        'embedding': query_emb,
        'top_k': top_k
    }).data()

    return results

def extract_entities_and_relationships(text):
    """Extract entities and relationships from text using Gemini"""
    client = genai.Client(api_key=GEMINI_API_KEY)

    prompt = (
        f"You are the query-analysis system for a plant disease diagnosis chatbot using RAG + a Knowledge Graph.\n\n"
        f"Your tasks:\n\n"
        f"1. Determine whether the user's query is related to plant diseases.\n"
        f"    - If the query is NOT related to plant diseases:\n"
        f"        * Return IsPlantDiseaseQuery = 0\n"
        f"        * Directly answer the user's question in a clear and concise way.\n"
        f"        * Do NOT extract entities or relationships.\n\n"
        f"        * The answer MUST be in Vietnamese  "
        f"    - If the query IS related to plant diseases:\n"
        f"        * Return IsPlantDiseaseQuery = 1\n\n"
        f"2. When IsPlantDiseaseQuery = 1:\n"
        f"    - Extract all relevant entities according to the following node types:\n"
        f"        * TenCay (PlantName)\n"
        f"        * Benh (Disease)\n"
        f"        * NguyenNhan (Cause)\n"
        f"        * TrieuChung (Symptom)\n"
        f"        * DieuTri (Treatment)\n"
        f"    - Extract relationships using the following relationship types:\n"
        f"        * BI_MAC\n"
        f"        * CACH_DIEU_TRI\n"
        f"        * CO_TRIEU_CHUNG\n"
        f"        * CO_ID_BENH\n"
        f"        * CO_NGUYEN_NHAN\n\n"
        f"3. If the query contains multiple symptoms or multiple plant-disease descriptions, extract ALL corresponding entities and relationships.\n\n"
        f"4. All output must be in English and strictly follow the structure below.\n\n"
        f"   Do not add comments, explanations, or extra text.\n\n"
        f"Follow this format:\n\n"
        f"IsPlantDiseaseQuery: {{0 or 1}}\n\n"
        f"If IsPlantDiseaseQuery = 0:\n"
        f"Answer: '{{Your direct answer to the user's question}}'\n\n"
        f"If IsPlantDiseaseQuery = 1:\n"
        f"Entities:\n"
        f"- {{EntityName}}: {{EntityType}}\n"
        f"...\n\n"
        f"Relationships:\n"
        f"- ({{Entity1}}, {{RelationshipType}}, {{Entity2}})\n"
        f"...\n\n"
        f"--------------------------------------------\n\n"
        f"Text:\n\"{text}\"\n\n"
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[prompt],
        config={
            "temperature": 1,
            "top_p": 1,
            "max_output_tokens": 2048,
            "frequency_penalty": 0,
            "presence_penalty": 0,
            "response_mime_type": "text/plain"
        }
    )
    return response

def parse_gemini_response(raw_text: str):
    """Parse Gemini response into structured format"""
    result = {
        "IsPlantDiseaseQuery": None,
        "Answer": None,
        "Entities": [],
        "Relationships": []
    }

    # Kiểm tra raw_text có tồn tại và là string không
    if not raw_text or not isinstance(raw_text, str):
        print(f"[KG Service] Warning: Invalid raw_text in parse_gemini_response: {raw_text}")
        return result

    # --- 1. Extract IsPlantDiseaseQuery ---
    match_query = re.search(r"IsPlantDiseaseQuery:\s*(\d+)", raw_text)
    if match_query:
        result["IsPlantDiseaseQuery"] = int(match_query.group(1))

    # --- 2. Extract Answer (only for case 0) ---
    match_answer = re.search(r"Answer:\s*(.+)", raw_text)
    if match_answer:
        result["Answer"] = match_answer.group(1).strip()

    # --- 3. Extract Entities: lines like "- name: Type" ---
    entities_block = re.search(r"Entities:\s*(.*?)\n\n", raw_text, re.DOTALL)
    if entities_block:
        lines = entities_block.group(1).strip().split("\n")
        for line in lines:
            match_entity = re.match(r"-\s*(.+?):\s*(.+)", line.strip())
            if match_entity:
                entity_name = match_entity.group(1).strip()
                entity_type = match_entity.group(2).strip()
                result["Entities"].append({
                    "name": entity_name,
                    "type": entity_type
                })

    # --- 4. Extract Relationships: lines like "- (A, REL, B)" ---
    rel_block = re.search(r"Relationships:\s*(.*)", raw_text, re.DOTALL)
    if rel_block:
        lines = rel_block.group(1).strip().split("\n")
        for line in lines:
            match_rel = re.match(r"-\s*\((.+?),\s*(.+?),\s*(.+?)\)", line.strip())
            if match_rel:
                e1 = match_rel.group(1).strip()
                rel = match_rel.group(2).strip()
                e2 = match_rel.group(3).strip()
                result["Relationships"].append({
                    "entity1": e1,
                    "relationship": rel,
                    "entity2": e2
                })

    return result

def dedupe_diseases(blocks):
    """Remove duplicate diseases from results"""
    seen = set()
    unique = []

    for block in blocks:
        disease = block.get("benh", "").strip().lower()

        if disease not in seen:
            seen.add(disease)
            unique.append(block)

    return unique

def remove_not_related(data_find, ten_cay):
    """Remove results not related to the specified plant"""
    results = []
    for r in data_find:
        if ten_cay.strip() == r.get('cay').strip():
            results.append(r)

    return results

def format_result(results_raw, ten_cay):
    """Format and clean search results"""
    results = remove_not_related(results_raw, ten_cay)  # xóa những cây không liên quan
    results = dedupe_diseases(results)  # xóa những bệnh lặp lại 2 lần
    return results

def query_by_input_text(query_text):
    """
    Query Knowledge Graph by input text
    Tương ứng với hàm trong process_main.ipynb (Cell 30)
    
    Args:
        query_text: User's text query
    
    Returns:
        Either a direct answer (if not plant disease query) or formatted results
    """
    response = extract_entities_and_relationships(query_text)

    result_after_parse = parse_gemini_response(response.text)

    results = []

    if result_after_parse["IsPlantDiseaseQuery"] == 0:
        return result_after_parse["Answer"]
    elif result_after_parse["IsPlantDiseaseQuery"] == 1:
        ten_cay = ""
        for relation in result_after_parse["Relationships"]:
            if relation['relationship'] == "CO_TRIEU_CHUNG":
                ten_cay = relation['entity1'].strip().lower()
                if ten_cay.startswith("cây "):
                    ten_cay = ten_cay[4:]

                query_text = ten_cay + " có các triệu chứng như sau: " + relation['entity2']

                print(query_text)

                results_sematic = semantic_search(
                                node_label="CaseBenh",
                                text_field="description",
                                embedding_field="description_embedding",
                                query_text=query_text,
                                top_k=5
                            )
                for r_se in results_sematic:
                    results.append(r_se)
            else:
                pass

        return format_result(results, ten_cay)

def query_by_casebenh(ten_cay, benh_cay):
    """
    Query Knowledge Graph by plant and disease name
    Hàm này tương ứng với hàm trong process_main.ipynb (dòng 36-43)
    
    Args:
        ten_cay: Plant name (Vietnamese)
        benh_cay: Disease name (Vietnamese)
    
    Returns:
        List of results with nguyen_nhan (cause) and dieu_tri (treatment)
    """
    graph = get_graph()
    case_benh = f"{ten_cay}-{benh_cay}"
    # Cypher query giống với process_main.ipynb
    query_casebenh = f"""
    MATCH (cb:CaseBenh {{id: "{case_benh}"}})-[:DO_NGUYEN_NHAN]->(nn:NguyenNhan)
    MATCH (cb)-[:CACH_DIEU_TRI]->(dt:DieuTri)
    RETURN nn.desc AS nguyen_nhan, dt.desc AS dieu_tri;
    """
    return graph.run(query_casebenh).data()

