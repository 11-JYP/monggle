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
      const x = ((coord.lng - minLng) / (maxLng - minLng)) * usableWidth + padding;
      const y = usableHeight - ((coord.lat - minLat) / (maxLat - minLat)) * usableHeight + padding;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = "#FF7B00";
    ctx.lineWidth = 4;
    ctx.stroke();
  }, [coordinates, size]);

  return <canvas ref={canvasRef} />;
};

export default CanvasComponent;
