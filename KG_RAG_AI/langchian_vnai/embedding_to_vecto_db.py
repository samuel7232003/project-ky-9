from typing import Union
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# file_loader
from typing import Union, List, Literal
import glob
from tqdm import tqdm
import multiprocessing
from langchain_community.document_loaders import PyPDFLoader, PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

class VectorDB:
  def __init__(self,
               documents = None,
               vector_db: Union[Chroma, FAISS] = Chroma,
               embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2"),
               ) -> None:
    self.vector_db = vector_db
    self.embedding = embedding
    self.db = self._build_db(documents)

  def _build_db(self, documents):
    return self.vector_db.from_documents(
                                        documents = documents,
                                        embedding = self.embedding
                                      )

  def get_retriever(self,
                    search_type: str = "similarity",
                    search_kwargs: dict = {"k": 10}):
    retriever = self.db.as_retriever(
                                    search_type = search_type,
                                    search_kwargs = search_kwargs
                                  )
    return retriever

  def save_retriever(self, path_save_vecto_db):
      self.db.save_local(path_save_vecto_db)

def remove_non_utf8_characters(text):
    return ''.join(char for char in text if ord(char) < 128)

def load_pdf(pdf_file):
  docs = PyPDFLoader(pdf_file, extract_images=False).load() # Changed extract_images to False
  for doc in docs:
    doc.page_content = remove_non_utf8_characters(doc.page_content)
  return docs

def get_num_cpu():
  return multiprocessing.cpu_count()

class BaseLoader:
  def __init__(self) -> None:
     self.num_processes = get_num_cpu()

  def __call__(self, files: List[str], **kwargs):
    pass

class PDFLoader(BaseLoader):
  def __init__(self) -> None:
    super().__init__()

  def __call__(self, pdf_file: List[str], **kwargs):
    num_processes = min(self.num_processes, kwargs["workers"] )
    with multiprocessing.Pool(processes=num_processes) as pool:
      doc_loaded = []
      total_files = len(pdf_file)
      with tqdm(total=total_files, desc="Loading PDFs", unit="file") as pbar:
        for result in pool. imap_unordered(load_pdf, pdf_file):
          doc_loaded.extend(result)
          pbar.update(1)
    return doc_loaded

class TextSplitter:
  def __init__(self,
               separators: List[str] = ["\n\n", "\n", " ", ""],
               chunk_size: int = 300,
               chunk_overlap: int = 0
               ) -> None:
    self.splitter = RecursiveCharacterTextSplitter(
                                        separators = separators,
                                        chunk_size = chunk_size,
                                        chunk_overlap = chunk_overlap
                                      )
  def __call__(self, documents): # Corrected __call_ to __call__
    return self.splitter.split_documents(documents)

class Loader:
  def __init__(self,
            file_type: str = Literal["pdf"],
            split_kwargs: dict = {
            "chunk_size": 300,
            "chunk_overlap": 0}
            ) -> None:
    assert file_type in ["pdf"], "file_type must be pdf"
    self.file_type = file_type
    if file_type == "pdf":
      self.doc_loader = PDFLoader( )
    else:
      raise ValueError("file_type must be pdf")

    self.doc_spltter = TextSplitter( ** split_kwargs)

  def load(self, pdf_files: Union[str, List[str]], workers: int = 1):
    if isinstance(pdf_files, str):
      pdf_files = [pdf_files]
    doc_loaded = self.doc_loader(pdf_files, workers=workers)
    doc_split = self.doc_spltter(doc_loaded)
    return doc_split

  def load_dir(self, dir_path: str, workers: int = 1):
      if self.file_type != "pdf":
          raise ValueError("file_type must be 'pdf'")

      files = glob.glob(f"{dir_path}/*.pdf")
      if not files:
          raise FileNotFoundError(f"No PDF files found in {dir_path}")

      return self.load(files, workers=workers)

if __name__ == "__main__":
    vector_db_path = "vectorstores/db_chroma"
    data_type = "pdf"
    data_dir = "data_source"

    doc_loaded = Loader(file_type=data_type).load_dir(data_dir, workers=2)
    retriever = VectorDB(documents=doc_loaded).save_retriever(vector_db_path)