---
title: 손실 함수 (Loss Function)
type: concept
tags: [ml]
aliases: [손실 함수, 비용 함수, loss, MSE 손실, MAE 손실]
sources:
  - "[[raw/books/02-데이터 분석/머신러닝 기초/pages/06-1-linear-regression-and-loss|머신러닝 기초 06-1]]"
  - "[[raw/books/02-데이터 분석/머신러닝 기초/pages/06-regression-basics|머신러닝 기초 06]]"
related: ["[[linear-regression]]", "[[regression-metrics]]", "[[regularization]]"]
updated: 2026-11-04
status: draft
---

# 손실 함수 (Loss Function)

## 정의
손실 함수는 모델의 틀림을 숫자로 측정해 학습이 최소화하려는 기준이다. 어떤 틀림을 더 크게 벌줄지를 정하므로, 같은 데이터라도 손실 함수에 따라 학습 결과와 이상치 민감도가 달라진다.

## 책별 관점
### [[machine-learning-basics|머신러닝 기초]]
- 손실 함수는 어떤 틀림을 더 싫어하는가를 반영한다. [[raw/books/02-데이터 분석/머신러닝 기초/pages/06-1-linear-regression-and-loss#손실 함수는 왜 필요한가|머신러닝 기초 06-1]]
- MSE 기반 학습은 오차를 제곱하므로 큰 오차를 강하게 벌주고 이상치에 민감하다. [[raw/books/02-데이터 분석/머신러닝 기초/pages/06-1-linear-regression-and-loss#MSE 기반 학습|머신러닝 기초 06-1]]
- MAE 관점은 절대 오차를 보므로 큰 오차에 덜 과민하다. [[raw/books/02-데이터 분석/머신러닝 기초/pages/06-1-linear-regression-and-loss#MAE 기반 관점|머신러닝 기초 06-1]]
- class_weight는 손실 함수에서 소수 클래스 실수에 더 큰 벌점을 주는 방식이다. [[raw/books/02-데이터 분석/머신러닝 기초/pages/09-3-imbalanced-data-and-smote#class_weight와 SMOTE는 어떻게 다를까|머신러닝 기초 09-3]]
- t-SNE는 고차원과 저차원 이웃 확률의 KL divergence를 손실로 최소화한다. [[raw/books/02-데이터 분석/머신러닝 기초/pages/11-6-tsne#6. 핵심 수식과 의미|머신러닝 기초 11-6]]

## 연결
- 연결: [[regression-metrics]] 평가 지표와 학습 손실은 겹치지만 역할이 다름
- 연결: [[regularization]] 손실에 계수 벌점을 더함
