// 데이터러너즈 영상 카탈로그.
// kind: "motion"(새로 만드는 모션그래픽 단편) | "lecture"(기존 강의 영상의 구간)
// status: "planned"(제작 예정) | "producing"(제작 중) | "published"(공개).
// ep 는 유튜브 제작 대기열 시트의 ep 번호와 같다. 영상이 올라오면 시트의 release_url(유튜브 주소)을
// release_url 에 붙여 넣거나 youtube_id 를 채우면, 레슨 본문의 ::video 자리에서 바로 재생된다(나머지는 '영상 준비 중').
// 영상은 트랙 페이지에 따로 모으지 않고, 관련 레슨 본문 안 흐름에 맞는 위치에 ::video{ref="dl-mNN"} 로 넣는다.
export const VIDEOS = [
  { id: "dl-m01", ep: 1, kind: "motion", track: "python-da", title: "NumPy 브로드캐스팅", concepts: ["np.broadcast"], length: "2분", brief: "(3,1) + (1,4) 배열이 늘어나 (3,4)가 되는 과정과 형상이 안 맞아 에러가 나는 경우", youtube_id: null, status: "planned" },
  { id: "dl-m02", ep: 2, kind: "motion", track: "python-da", title: "axis=0 / axis=1 | sum과 drop 방향이 반대로 느껴지는 이유", concepts: ["np.axis"], length: "1.5분", brief: "sum·mean·concat·drop에서 데이터가 어느 방향으로 접히는지", youtube_id: "bwQmWIefBKo", release_url: "https://www.youtube.com/watch?v=bwQmWIefBKo", status: "published" },
  { id: "dl-m03", ep: 3, kind: "motion", track: "python-da", title: "groupby (split-apply-combine)", concepts: ["pd.groupby"], length: "2분", brief: "행이 키별로 나뉘고, 각 그룹이 집계되고, 다시 합쳐지는 3단계. agg와 transform의 차이", youtube_id: null, status: "planned" },
  { id: "dl-m04", ep: 4, kind: "motion", track: "sql", title: "JOIN 종류 (INNER, LEFT, FULL)", concepts: ["sql.join"], length: "2분", brief: "키가 맞는 행끼리 줄이 이어지고, 매칭 없는 행에 NULL이 채워지는 과정. 키 중복 시 행이 불어남", youtube_id: null, status: "planned" },
  { id: "dl-m05", ep: 5, kind: "motion", track: "sql", title: "쿼리 논리 실행 순서", concepts: ["sql.exec-order"], length: "2분", brief: "FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY 순으로 테이블이 깎여 나가는 모습", youtube_id: null, status: "planned" },
  { id: "dl-m06", ep: 6, kind: "motion", track: "stats", title: "표본분포와 중심극한정리", concepts: ["st.clt"], length: "2.5분", brief: "치우친 모집단에서 표본평균을 반복 추출하면 히스토그램이 정규분포로 쌓이는 시뮬레이션", youtube_id: null, status: "planned" },
  { id: "dl-m07", ep: 7, kind: "motion", track: "stats", title: "95% 신뢰구간의 의미", concepts: ["st.ci"], length: "2분", brief: "표본을 100번 뽑아 만든 구간 중 약 95개만 참값을 포함하는 장면", youtube_id: null, status: "planned" },
  { id: "dl-m08", ep: 8, kind: "motion", track: "stats", title: "가설검정과 p-value", concepts: ["st.test"], length: "2.5분", brief: "귀무분포 위에 관측 통계량이 찍히고 꼬리 면적이 칠해지는 과정, 유의수준·기각역", youtube_id: null, status: "planned" },
  { id: "dl-m09", ep: 9, kind: "motion", track: "ml", title: "경사하강법, 기울기를 따라 내려가는 법", concepts: ["ml.gd", "dl.loss"], length: "1:09", brief: "손실 곡면 위를 공이 굴러가는 모습, 학습률이 너무 크면 발산·작으면 느림", youtube_id: "ahgBfG3pxzg", release_url: "https://www.youtube.com/watch?v=ahgBfG3pxzg", status: "published" },
  { id: "dl-m10", ep: 10, kind: "motion", track: "ml", title: "편향-분산 트레이드오프 | 완벽한 모델이 실전에서 망하는 이유", concepts: ["ml.overfit"], length: "3:45", brief: "다항 차수를 올릴수록 학습 오차는 줄고 검증 오차는 U자로 돌아오는 곡선", youtube_id: "VLCbpbxHfoY", release_url: "https://www.youtube.com/watch?v=VLCbpbxHfoY", status: "published" },
  { id: "dl-m11", ep: 11, kind: "motion", track: "ml", title: "임계값과 precision / recall / ROC", concepts: ["ml.metrics"], length: "2.5분", brief: "임계값을 옮길 때 혼동행렬 4칸이 바뀌고 ROC 곡선 위 점이 이동하는 모습", youtube_id: null, status: "planned" },
  { id: "dl-m12", ep: 12, kind: "motion", track: "dl", title: "순전파와 역전파", concepts: ["dl.backprop"], length: "3분", brief: "값이 앞으로 흐르고, 그래디언트가 연쇄법칙으로 뒤로 흐르며 가중치가 갱신되는 계산 그래프", youtube_id: null, status: "planned" },
  { id: "dl-m13", ep: 13, kind: "motion", track: "dl", title: "CNN 합성곱과 풀링", concepts: ["dl.cnn"], length: "2분", brief: "필터가 이미지 위를 미끄러지며 특징 맵을 만들고, stride·padding에 따라 크기가 바뀌는 모습", youtube_id: null, status: "planned" },
  { id: "dl-m14", ep: 14, kind: "motion", track: "python-basic", title: "변수와 객체 참조", concepts: ["py.object-ref", "py.variable"], length: "2분", brief: "b = a 후 리스트를 바꾸면 둘 다 바뀌는 이유(이름표와 상자), copy와의 차이", youtube_id: null, status: "planned" },
  { id: "dl-m15", ep: 15, kind: "motion", track: "python-basic", title: "반복문 실행 흐름", concepts: ["py.loop-flow", "py.for", "py.while"], length: "1.5분", brief: "for/while에서 변수 값이 회차마다 바뀌는 추적표, break·continue 분기", youtube_id: null, status: "planned" },
  { id: "dl-m16", ep: 16, kind: "motion", track: "python-basic", title: "함수 호출과 스코프", concepts: ["py.scope", "py.function"], length: "1.5분", brief: "호출 시 새 지역 공간이 쌓이고 return 후 사라지는 스택", youtube_id: null, status: "planned" },
  { id: "dl-m17", ep: 17, kind: "motion", track: "python-da", title: "pivot_table / melt", concepts: ["pd.pivot"], length: "2분", brief: "long ↔ wide 형태로 셀이 재배치되는 과정", youtube_id: null, status: "planned" },
  { id: "dl-m18", ep: 18, kind: "motion", track: "python-da", title: "merge 시 행 증가", concepts: ["pd.merge"], length: "1분", brief: "키 중복(1:N, N:M)으로 결과 행이 늘어나는 함정", youtube_id: null, status: "planned" },
  { id: "dl-m19", ep: 19, kind: "motion", track: "python-da", title: "rolling / resample", concepts: ["pd.time"], length: "1.5분", brief: "시계열 위를 창이 미끄러지며 평활화되거나, 일 → 주 단위로 묶이는 모습", youtube_id: null, status: "planned" },
  { id: "dl-m20", ep: 20, kind: "motion", track: "sql", title: "윈도우 함수 (PARTITION BY, 프레임)", concepts: ["sql.window"], length: "2분", brief: "파티션별로 창이 한 행씩 미끄러지며 누적합·이동평균 계산. GROUP BY와 달리 행 수 유지", youtube_id: null, status: "planned" },
  { id: "dl-m21", ep: 21, kind: "motion", track: "stats", title: "제1·2종 오류와 검정력", concepts: ["st.power"], length: "2분", brief: "귀무·대립 분포 두 개가 겹치고, 표본 수가 늘면 분포가 좁아져 검정력이 오르는 모습", youtube_id: null, status: "planned" },
  { id: "dl-m22", ep: 22, kind: "motion", track: "stats", title: "선형 회귀와 최소제곱법", concepts: ["st.regression"], length: "3:55", brief: "직선이 움직일 때 잔차 제곱(사각형 면적) 합이 변하고 최소에서 멈추는 모습", youtube_id: "V-XWYw1zraQ", release_url: "https://www.youtube.com/watch?v=V-XWYw1zraQ", status: "published" },
  { id: "dl-m23", ep: 23, kind: "motion", track: "ml", title: "결정트리와 앙상블", concepts: ["ml.tree"], length: "2.5분", brief: "트리가 공간을 수직·수평으로 쪼개고, 배깅은 투표·부스팅은 잔차를 순차 보정하는 차이", youtube_id: null, status: "planned" },
  { id: "dl-m24", ep: 24, kind: "motion", track: "ml", title: "K-fold 교차검증", concepts: ["ml.cv"], length: "1분", brief: "검증 폴드가 한 칸씩 이동하며 점수 k개가 모이는 과정, 데이터 누수 예", youtube_id: null, status: "planned" },
  { id: "dl-m25", ep: 25, kind: "motion", track: "ml", title: "K-means 군집", concepts: ["ml.kmeans"], length: "1.5분", brief: "중심점 배치 → 할당 → 중심 이동 반복으로 수렴하는 모습", youtube_id: null, status: "planned" },
  { id: "dl-m26", ep: 26, kind: "motion", track: "ml", title: "PCA", concepts: ["ml.pca"], length: "2분", brief: "데이터 구름에 맞춰 축이 회전하고 점들이 주성분 축에 투영되는 모습", youtube_id: null, status: "planned" },
  { id: "dl-m27", ep: 27, kind: "motion", track: "dl", title: "RNN 시간 펼치기", concepts: ["dl.rnn"], length: "2분", brief: "같은 셀이 시점마다 은닉 상태를 넘기는 구조, 길어지면 정보가 흐려지는 문제", youtube_id: null, status: "planned" },
  { id: "dl-m28", ep: 28, kind: "motion", track: "dl", title: "어텐션 (Q, K, V)", concepts: ["dl.attention"], length: "3분", brief: "한 단어가 다른 단어들과 유사도를 계산하고 가중합으로 새 표현을 만드는 과정", youtube_id: null, status: "planned" },
  // 채널에 먼저 공개된 영상(제작 대기열 밖). 2026-11-05 채널 목록과 대조해 추가.
  { id: "dl-m29", ep: 29, kind: "motion", track: "ml", title: "직선을 꺾어 확률을 만드는 법: 로지스틱 회귀", concepts: ["ml.linear"], length: "2:12", brief: "직선의 점수를 시그모이드에 통과시켜 0~1 확률로 바꾸고 0.5 기준으로 분류", youtube_id: "hJ4DIa0ofNw", release_url: "https://www.youtube.com/watch?v=hJ4DIa0ofNw", status: "published" },
  { id: "dl-m30", ep: 30, kind: "motion", track: "ml", title: "데이터 단위가 다를 때 인공지능이 겪는 착각 (정규화와 표준화)", concepts: ["ml.feature"], length: "3:21", brief: "단위가 큰 열이 거리·기울기 계산을 독차지하는 문제와 정규화·표준화로 잣대를 맞추는 방법", youtube_id: "DgM-sZers1M", release_url: "https://www.youtube.com/watch?v=DgM-sZers1M", status: "published" },
  { id: "dl-m31", ep: 31, kind: "motion", track: "dl", title: "손실 함수 MSE vs 로그 손실: 왜 분류에선 로그를 쓸까?", concepts: ["dl.loss"], length: "3:26", brief: "회귀는 MSE, 분류는 로그 손실(교차엔트로피)을 쓰는 이유. 자신 있게 틀릴수록 벌점이 폭발", youtube_id: "rfCLDbwXjlU", release_url: "https://www.youtube.com/watch?v=rfCLDbwXjlU", status: "published" },
  { id: "dl-m32", ep: 32, kind: "motion", track: "dl", title: "미니배치와 확률적 경사하강법(SGD)", concepts: ["dl.loss", "ml.gd"], length: "2:35", brief: "전체 데이터 대신 일부로 기울기를 계산해 빠르게 내려가는 방법, 배치·SGD·미니배치 비교", youtube_id: "vJhHRNjPNZ4", release_url: "https://www.youtube.com/watch?v=vJhHRNjPNZ4", status: "published" },
  // 나이브 베이즈 영상: ml-10-2 레슨 본문에 배치(2026-11-05).
  { id: "dl-m33", ep: 33, kind: "motion", track: "ml", title: "나이브 베이즈: 복잡한 확률을 단순하게 푸는 마법", concepts: ["ml.nb"], length: "3:25", brief: "특성들이 서로 독립이라고 가정해 조건부 확률을 곱으로 단순화하는 분류기", youtube_id: "YK9E8RsUveY", release_url: "https://www.youtube.com/watch?v=YK9E8RsUveY", status: "published" },
  { id: "dl-m34", ep: 34, kind: "motion", track: "ml", title: "라플라스 스무딩 | 확률이 0이 되는 재앙을 막는 방법", concepts: ["ml.nb"], length: "3:04", brief: "한 번도 안 나온 값 때문에 확률 곱이 0이 되는 문제를 모든 빈도에 1을 더해 막는 방법", youtube_id: "S76hQR33eBA", release_url: "https://www.youtube.com/watch?v=S76hQR33eBA", status: "published" },
];

export const videoById = Object.fromEntries(VIDEOS.map((v) => [v.id, v]));
export const VIDEO_STATUS = { planned: "제작 예정", producing: "제작 중", published: "공개" };
