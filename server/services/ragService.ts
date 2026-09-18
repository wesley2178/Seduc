import { db } from '../db/store';
import { RagDocument } from '../../src/types';

export class RagService {
  /**
   * Busca semântica e por palavras-chave com ranking de relevância
   */
  public searchContext(query: string, disciplina?: string, limit = 4): RagDocument[] {
    const docs = db.getRagDocuments();
    const queryTokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);

    const scored = docs.map(doc => {
      let score = 0;
      const textLower = doc.text.toLowerCase();
      const titleLower = doc.source_title.toLowerCase();
      const assuntoLower = (doc.assunto || '').toLowerCase();

      // Priorizar disciplina correspondente
      if (disciplina && doc.disciplina && doc.disciplina.toLowerCase().includes(disciplina.toLowerCase())) {
        score += 5;
      }

      for (const token of queryTokens) {
        if (titleLower.includes(token)) score += 3;
        if (assuntoLower.includes(token)) score += 3;
        if (textLower.includes(token)) score += 1;
      }

      return { doc, score };
    });

    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.doc);
  }

  /**
   * Ingestão e chunking de novo documento oficial
   */
  public ingestDocument(
    sourceTitle: string,
    documentType: 'EDITAL' | 'PROVA' | 'LEGISLACAO' | 'BNCC' | 'DIRETRIZ',
    fullText: string,
    metadata: {
      edital_id?: string;
      disciplina?: string;
      assunto?: string;
      source_url?: string;
    }
  ): RagDocument[] {
    const chunkSize = 600; // caracteres por chunk
    const chunks: string[] = [];
    
    // Divide por parágrafos ou tamanho
    const paragraphs = fullText.split(/\n\s*\n/);
    let currentChunk = '';

    for (const p of paragraphs) {
      if ((currentChunk + '\n' + p).length > chunkSize && currentChunk.length > 100) {
        chunks.push(currentChunk.trim());
        currentChunk = p;
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + p;
      }
    }
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    const createdDocs: RagDocument[] = chunks.map((chunk, index) => {
      const doc: RagDocument = {
        document_id: `rag_${Date.now()}_${index}`,
        document_type: documentType,
        source_title: `${sourceTitle} (Parte ${index + 1})`,
        text: chunk,
        edital_id: metadata.edital_id,
        disciplina: metadata.disciplina,
        assunto: metadata.assunto,
        source_url: metadata.source_url,
        created_at: new Date().toISOString()
      };
      db.addRagDocument(doc);
      return doc;
    });

    return createdDocs;
  }
}

export const ragService = new RagService();
