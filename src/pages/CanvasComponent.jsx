import { useEffect, useRef } from "react";

const CanvasComponent = ({ size, coordinates }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 캔버스 크기 설정 (size x size)
    const canvasSize = size;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 패딩 설정
    const padding = 20;
    const usableWidth = canvasSize - padding * 2;
    const usableHeight = canvasSize - padding * 2;

    // 첫 번째 좌표를 기준으로 중앙으로 이동
    const latitudes = coordinates.map((coord) => coord.lat);
    const longitudes = coordinates.map((coord) => coord.lng);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    // 각 좌표를 캔버스의 usableWidth와 usableHeight에 맞춰 변환
    ctx.beginPath();

    coordinates.forEach((coord, index) => {
      const x = ((coord.lng - minLng) / (maxLng - minLng)) * usableWidth + padding; // X좌표 변환
      const y = usableHeight - ((coord.lat - minLat) / (maxLat - minLat)) * usableHeight + padding; // Y좌표 변환
      if (index === 0) {
        ctx.moveTo(x, y); // 첫 번째 점으로 이동
      } else {
        ctx.lineTo(x, y); // 나머지 점으로 선 연결
      }
    });

    ctx.strokeStyle = "#fff"; // 선 색상
    ctx.lineWidth = 5; // 선 두께
    ctx.stroke(); // 선 그리기
  }, [coordinates, size]);

  return <canvas ref={canvasRef} />;
};

export default CanvasComponent;
