export default function RoomCard({ id, name, price, capacity, status, onBook }) {
  const statusColor = status === 'Available' 
    ? 'bg-green-100 text-green-700' 
    : 'bg-red-100 text-red-700';

  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition bg-white flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-blue-800">{name}</h3>
        <p className="text-gray-600 mt-2">Sức chứa: {capacity} người</p>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-semibold text-orange-600">{price} VNĐ/đêm</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
            {status === 'Available' ? 'Trống' : 'Đang sử dụng'}
          </span>
        </div>
      </div>

      {/* Nút Đặt phòng mới được thêm vào */}
        <button 
        disabled={status !== 'Available'}
        // Bắt sự kiện click và gửi id ngược lại hàm onBook
        onClick={() => onBook(id)} 
        className={`mt-6 w-full py-2 rounded-md font-bold text-white transition duration-300
          ${status === 'Available' 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-gray-400 cursor-not-allowed'}
        `}
      >
        {status === 'Available' ? 'Đặt phòng ngay' : 'Không khả dụng'}
      </button>
    </div>
  );
}