---
title: 임베딩 (Embedding)
type: concept
tags: [llm, rag]
aliases: [임베딩, embedding, 텍스트 임베딩, text-embedding-3-small, 벡터 표현]
sources:
  - "[[raw/books/03-도구·자동화/n8n을 활용한 데이터 워크플로우 구축/pages/04-6-text-to-sql|n8n 4-6]]"
related: ["[[vector-database]]", "[[chunking]]", "[[rag]]"]
updated: 2026-11-04
status: draft
---

# 임베딩 (Embedding)

## 정의
텍스트 같은 데이터를 의미가 비슷할수록 가까운 위치에 오도록 고정 길이 숫자 벡터로 바꾼 표현이다. 벡터 DB의 유사도 검색은 같은 임베딩 모델이 만든 벡터 공간 안에서만 의미가 있다.

## 책별 관점
### [[n8n-data-workflow|n8n을 활용한 데이터 워크플로우 구축]]
- 문서 청크를 벡터로 바꾸기 위해 Embeddings OpenAI 노드에서 `text-embedding-3-small` 사용 [[raw/books/03-도구·자동화/n8n을 활용한 데이터 워크플로우 구축/pages/04-6-text-to-sql#4-6-9. Embeddings OpenAI|n8n 4-6]]
- 문서 저장 시와 검색 시의 임베딩 모델이 같아야 벡터 공간이 일치해 유사도 검색이 동작 [[raw/books/03-도구·자동화/n8n을 활용한 데이터 워크플로우 구축/pages/04-6-text-to-sql#4-6-9. Embeddings OpenAI|n8n 4-6]]
- Supabase `documents` 테이블의 embedding 컬럼은 `vector(1536)` 차원 [[raw/books/03-도구·자동화/n8n을 활용한 데이터 워크플로우 구축/pages/04-6-text-to-sql#4-6-6. Supabase Vector DB 생성|n8n 4-6]]
- Embedding Batch Size로 한 번에 변환할 청크 수를 조정 [[raw/books/03-도구·자동화/n8n을 활용한 데이터 워크플로우 구축/pages/04-6-text-to-sql#Embedding Batch Size|n8n 4-6]]

## 연결
- 연결: [[vector-database]] 임베딩을 저장·검색
- 연결: [[chunking]] 임베딩 전 문서 분할
- 연결: [[rag]] 임베딩 기반 검색
