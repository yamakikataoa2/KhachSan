export default function Services() {
  // Dữ liệu mẫu cho các dịch vụ của khách sạn
  const services = [
    { id: 1, name: "Nhà hàng & Bar 5 Sao", icon: "🍽️", description: "Thưởng thức tinh hoa ẩm thực Á - Âu từ các đầu bếp trứ danh trong không gian lãng mạn.", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop" },
    { id: 2, name: "Spa & Massage Trị Liệu", icon: "💆‍♀️", description: "Đánh thức mọi giác quan và tái tạo năng lượng hoàn hảo với các liệu pháp thảo dược tự nhiên.", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=600&auto=format&fit=crop" },
    { id: 3, name: "Hồ Bơi Vô Cực Nước Ấm", icon: "🏊‍♂️", description: "Đắm mình trong làn nước xanh mát, nhâm nhi ly cocktail và ngắm nhìn toàn cảnh thành phố từ trên cao.", image: "https://images.unsplash.com/photo-1582604662095-dc195bb21556?q=80&w=600&auto=format&fit=crop" },
    { id: 4, name: "Phòng Gym Hiện Đại 24/7", icon: "🏋️‍♂️", description: "Duy trì thói quen rèn luyện sức khỏe ngay cả trong kỳ nghỉ với hệ thống máy móc tập luyện tối tân nhất.", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop" }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* Phần Banner Tiêu đề */}
      <div className="bg-blue-900 text-white py-16 px-4 text-center shadow-inner">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Dịch Vụ & Tiện Ích</h1>
        <p className="mt-4 text-blue-200 max-w-2xl mx-auto text-lg">
          Trải nghiệm những dịch vụ đẳng cấp được thiết kế riêng để mang lại kỳ nghỉ hoàn hảo và đáng nhớ nhất cho bạn.
        </p>
      </div>

      {/* Danh sách dịch vụ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {services.map((svc) => (
            <div key={svc.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group flex flex-col xl:flex-row border border-gray-100 hover:shadow-2xl transition duration-300">
              
              {/* Hình ảnh */}
              <div className="xl:w-2/5 h-64 xl:h-auto overflow-hidden">
                <img src={svc.image} alt={svc.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              </div>
              
              {/* Nội dung */}
              <div className="p-8 xl:w-3/5 flex flex-col justify-center">
                <div className="text-4xl mb-4">{svc.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{svc.name}</h3>
                <p className="text-gray-600 leading-relaxed">{svc.description}</p>
                <button className="mt-6 self-start text-blue-600 font-bold hover:text-blue-800 flex items-center gap-2 transition group-hover:translate-x-2">
                  Tìm hiểu thêm <span className="text-xl">→</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}