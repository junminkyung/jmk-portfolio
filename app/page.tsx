import Image from "next/image";

const projects = [
  {
    no: "01", title: "Isaac Sim 기반 알고리즘 검증 환경", status: "진행 중", period: "2026.03 — 현재",
    summary: "실제 로봇·센서·운용 환경을 시뮬레이션에 재구성하고 ROS 2 인지 알고리즘을 반복 검증할 수 있는 디지털 트윈 환경을 구축했습니다.",
    challenge: "현장 방문과 실제 데이터 수집에 의존하던 검증 흐름을 재현 가능한 시뮬레이션 시험으로 전환",
    work: ["Parkie 로봇 USD 및 Mid-360·QT64 센서 구성", "D405·Gemini 카메라와 IMU, ROS 2 데이터 연동", "GTC 환경 메시 정리와 재질·조명 구성", "Isaac Sim 5.1.0에서 6.0.1로 센서·ROS API 마이그레이션"],
    result: "로봇 구동·리프팅, LiDAR·Camera 출력, marker detection 등 실제 알고리즘 연동 시험 환경 확보",
    tags: ["Isaac Sim", "OpenUSD", "ROS 2", "RTX LiDAR", "Digital Twin"],
    media: [] as { src: string; caption: string; width: number; height: number }[]
  },
  {
    no: "02", title: "Dual Marker Pose 추정 안정화", status: "완료", period: "2026.01 — 2026.05",
    summary: "듀얼 ArUco 마커 기반 6-DOF pose 추정에서 필터가 사실상 동작하지 않던 구조적 결함을 찾아내고, Ceres 비선형 최적화와 회전 특성을 고려한 필터링 파이프라인으로 재설계했습니다.",
    challenge: "LPF가 매 프레임 재초기화되어 필터 출력이 원본과 동일(무효화)했고, cutoff 100Hz 설정으로 보간 계수가 1에 수렴. 거리(z) 증가 시 pitch 분산이 커지고 에러 상황에서 2° 이상 jump가 48건 발생",
    work: ["LPF 반복 초기화 버그 수정 및 cutoff 주파수 100Hz → 5Hz 재설정 (주파수별 정량 비교)", "Quaternion 부호 모호성을 처리한 SLERP 기반 LPF 적용", "Ceres solvePnP 구현 — Huber loss, Quaternion Manifold, roll/yaw soft constraint로 재투영 오차 직접 최소화", "Quaternion median을 Geodesic Medoid에서 Weiszfeld's algorithm으로 교체, One Euro Filter로 변화율 기반 적응 필터링", "동일 rosbag 기반 6개 버전 조합 비교 — pitch std/range, z std, gap·jump 건수로 정량 평가"],
    result: "정상 주행 pitch 표준편차 0.610° → 0.248° (59% 감소, 변동 범위 3.16° → 1.46°), 에러 데이터 1.982° → 1.158° (42% 감소), 2° 이상 pitch jump 48건 → 0건 완전 소거",
    tags: ["C++", "OpenCV", "Ceres Solver", "Quaternion", "Signal Filtering", "Eigen"],
    media: [
      { src: "/projects/pose-filter-stages.png", caption: "초기화 버그 수정 후 필터 단계별 pitch 시계열 — 위에서부터 LPF, Median, Original. 수정 전에는 세 값이 완전히 동일했다.", width: 760, height: 487 },
      { src: "/projects/pose-pitch-variance-lut.png", caption: "거리(z)별 pitch 분산 LUT — z 증가에 따른 분산 증가를 정량화해 필터 설계 근거로 사용.", width: 760, height: 271 }
    ]
  },
  {
    no: "03", title: "Marker 검출 성능·연산 최적화", status: "완료", period: "2026.03 — 2026.05",
    summary: "장축(long-base) 차량에서의 원거리 미검출 문제를 해결하면서, 늘어난 연산 비용을 Dynamic ROI와 실행 조건 제어로 되돌린 검출-비용 동시 최적화 프로젝트입니다.",
    challenge: "장축 차량에서 약 1.5m 이후 마커 검출 실패, 주행 중 검출률 5.8% 수준. 이를 해결하는 APRILTAG refinement는 처리 시간을 약 5배(3.15ms → 15.16ms) 증가시키고, 검출 노드 2개 상시 실행으로 CPU 부하 가중",
    work: ["ROI 영역 Sharpening 전처리로 마커 과검출·미검출 개선", "cornerRefinement(NONE·SUBPIX·APRILTAG) × 전처리 조합 12개 케이스 정량 비교", "Kalman Filter 중심 추적 기반 Dynamic ROI 설계 — INIT·TRACKING·SEARCHING·RECOVERY 4-state 구조", "주행 모드 flag 기반으로 robot/docking 검출 노드를 필요 시에만 활성화", "부하(stress-ng) 환경 포함 처리 시간 Mean·P95·P99 tail latency 분석"],
    result: "주행 중 검출 건수 31건 → 534건 (약 17배), 과검출로 인한 z 표준편차 76배 감소·pitch 변동 범위 97% 감소. 평균 처리 시간 15.16ms → 7.56ms (50% 단축), 마커 검출 CPU 점유율 52.5% → 37.5%",
    tags: ["Computer Vision", "Dynamic ROI", "Kalman Filter", "Real-time Optimization", "ROS 2"],
    media: [
      { src: "/projects/roi-tracking.png", caption: "TRACKING 상태의 Dynamic ROI — 차량 하부 저조도 환경에서 듀얼 마커 검출 및 pose 축 표시.", width: 1128, height: 720 },
      { src: "/projects/roi-state-machine.png", caption: "Dynamic ROI 상태 전이 구조 — INIT · TRACKING · SEARCHING · RECOVERY 4-state와 fallback 경로.", width: 1360, height: 1960 }
    ]
  }
];

const subProjects = [
  {
    title: "멀티카메라 GigE 스트리밍 병목 분석", period: "2026.03 — 2026.04",
    note: "카메라 4대 동시 스트리밍의 프레임 유실 원인을 4차 실험·지연 측정으로 계층별(스위치 → PoE 공유 대역폭 → 업링크) 규명하고, 안정 동작 스트림 조건과 권장 네트워크 구성을 도출."
  }
];

const stack = ["Isaac Sim", "OpenUSD", "ROS 2", "C++", "Python", "OpenCV", "Ceres Solver", "Eigen", "LiDAR", "Camera", "GigE Vision", "Docker"];

export default function Home() {
  return <div className="portfolio-shell">
    <aside className="side">
      <a className="identity" href="#home"><span>MK</span><div><b>전민경</b><small>Robotics SW Engineer</small></div></a>
      <nav><a href="#home" className="active">Overview</a><a href="#projects">Projects</a><a href="#approach">Approach</a><a href="#skills">Skills</a><a href="#contact">Contact</a></nav>
      <div className="side-note"><span>FOCUS</span><strong>Simulation × Perception</strong><p>실제 로봇의 문제를 재현하고 검증 가능한 소프트웨어로 바꿉니다.</p></div>
      <small className="copyright">© 2026 JEON MINKYUNG</small>
    </aside>

    <main>
      <header className="top"><span>PORTFOLIO · UPDATED 2026.07</span><div><i/>Available for new challenges</div></header>
      <section className="hero" id="home">
        <div><span className="eyebrow">ROBOTICS · SIMULATION · PERCEPTION</span><h1>로봇이 현실에서<br/><em>안정적으로 동작하도록</em><br/>검증합니다.</h1><p>Isaac Sim 기반 디지털 트윈부터 ROS 2 센서 파이프라인, 카메라·LiDAR 인지 알고리즘까지. 실제 환경에서 발견한 문제를 재현하고 수치로 개선하는 로보틱스 소프트웨어 엔지니어입니다.</p><div className="actions"><a href="#projects">프로젝트 보기 <b>↘</b></a><a href="#approach">일하는 방식 →</a></div></div>
        <div className="focus-card"><span>ENGINEERING FOCUS</span><h2>Sim-to-Real<br/>Validation Loop</h2><ol><li><b>01</b><div>MODEL<small>로봇·센서·환경 모델링</small></div></li><li><b>02</b><div>CONNECT<small>ROS 2·인지 파이프라인 연동</small></div></li><li><b>03</b><div>VALIDATE<small>실패 재현·정량 비교·개선</small></div></li></ol></div>
      </section>

      <section className="section" id="projects"><div className="section-head"><span>01 / SELECTED PROJECTS</span><div><h2>구현 내용과 결과가<br/>분명한 프로젝트</h2><p>사내 정보는 제외하고 문제, 기술적 판단, 검증 결과를 중심으로 정리했습니다.</p></div></div>
        <div className="project-list">{projects.map(p=><article className="project" key={p.no}><div className="project-meta"><b>{p.no}</b><span>{p.status}</span><small>{p.period}</small></div><div className="project-main"><h3>{p.title}</h3><p className="summary">{p.summary}</p><div className="project-grid"><div><h4>PROBLEM</h4><p>{p.challenge}</p></div><div><h4>IMPLEMENTATION</h4><ul>{p.work.map(x=><li key={x}>{x}</li>)}</ul></div><div className="result"><h4>RESULT</h4><p>{p.result}</p></div></div>{p.media.length>0&&<div className="project-media">{p.media.map(m=><figure key={m.src}><Image src={m.src} alt={m.caption} width={m.width} height={m.height}/><figcaption>{m.caption}</figcaption></figure>)}</div>}<div className="tags">{p.tags.map(x=><span key={x}>{x}</span>)}</div></div></article>)}</div>
        <div className="sub-projects"><span>+ SIDE WORK</span>{subProjects.map(s=><p key={s.title}><b>{s.title}</b> · {s.period} — {s.note}</p>)}</div>
      </section>

      <section className="section split" id="approach"><div className="section-head compact"><span>02 / APPROACH</span><div><h2>실제 로봇에서<br/>안정적으로 동작하는가?</h2></div></div><div className="principles"><article><b>01</b><h3>현상을 수치로 바꿉니다.</h3><p>감각적인 ‘떨림’이나 ‘느림’을 표준편차, 범위, 처리 시간과 CPU 사용률로 정의합니다.</p></article><article><b>02</b><h3>실패 조건을 재현합니다.</h3><p>가림, 원거리, 차량 하부, 부하 상황을 실제 데이터와 시뮬레이션 양쪽에서 반복 가능한 시험으로 만듭니다.</p></article><article><b>03</b><h3>정확도와 실시간성을 함께 봅니다.</h3><p>검출 범위만 늘리지 않고 ROI, 실행 조건, 센서 구성까지 시스템 전체 비용을 함께 최적화합니다.</p></article></div></section>

      <section className="section skills" id="skills"><div><span className="eyebrow">03 / TOOLBOX</span><h2>기술 스택</h2></div><div className="stack">{stack.map(x=><span key={x}>{x}</span>)}</div></section>
      <footer id="contact"><div><span>LET’S BUILD RELIABLE ROBOTS</span><h2>로봇과 시뮬레이션 사이의<br/>간극을 줄입니다.</h2></div><p>연락처와 GitHub 링크는 공개 준비 후 추가할 예정입니다.</p></footer>
    </main>
  </div>
}
