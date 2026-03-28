import { Link } from 'react-router-dom';

export default function Home() {
  // Mock dữ liệu 3 phòng nổi bật để hiển thị trên trang chủ
  const featuredRooms = [
    { id: 1, name: "Phòng Tiêu Chuẩn Luxury", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600&auto=format&fit=crop", price: "800.000", description: "Không gian ấm cúng, đầy đủ tiện nghi cho cặp đôi." },
    { id: 2, name: "Phòng VIP Panorama", image: "https://images.unsplash.com/photo-1590490360182-c33d59735088?q=80&w=600&auto=format&fit=crop", price: "1.500.000", description: "Tầm nhìn 360 độ toàn thành phố, dịch vụ thượng hạng." },
    { id: 3, name: "Phòng Gia Đình Royal", image: "https://images.unsplash.com/photo-1608198399264-39fe42ca1d2d?q=80&w=600&auto=format&fit=crop", price: "2.200.000", description: "Rộng rãi, thiết kế sang trọng, có khu vực bếp riêng." },
  ];

  return (
    <div className="bg-white text-gray-800">

      {/* 1. SECTION HERO (BANNER LỚN) */}
      <section className="relative h-[85vh] flex items-center justify-center bg-gray-900 text-white">
        {/* Hình nền */}
        <img 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920&auto=format&fit=crop" 
          alt="Khách sạn ABC" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
        />
        {/* Nội dung */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Trải Nghiệm Kỳ Nghỉ <span className="text-amber-400">Hoàn Hảo</span> Tại Hotel ABC
          </h1>
          <p className="mt-6 text-xl text-gray-200 max-w-2xl mx-auto">
            Nơi sự sang trọng hòa quyện cùng sự tiện nghi, mang đến cho bạn và gia đình những giây phút thư giãn không thể nào quên.
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <Link to="/rooms" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-bold transition duration-300 shadow-lg transform hover:-translate-y-1">
              Khám Phá Phòng
            </Link>
            <Link to="/services" className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-3.5 rounded-full font-bold transition duration-300 shadow-sm">
              Xem Dịch Vụ
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SECTION GIỚI THIỆU LỜI CHÀO */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-blue-600 font-bold tracking-widest uppercase">Về Chúng Tôi</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2 leading-tight">Biểu Tượng Của Sự Sang Trọng & Lòng Hiếu Khách</h2>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Tọa lạc tại trung tâm thành phố, Hotel ABC tự hào là điểm đến lý tưởng cho cả khách du lịch và thương nhân. Với lịch sử hơn 20 năm, chúng tôi cam kết mang lại dịch vụ vượt trội, không gian được thiết kế tinh tế và ẩm thực độc đáo.
            </p>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              Hãy để chúng tôi chăm sóc từng chi tiết nhỏ nhất trong kỳ nghỉ của bạn.
            </p>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop" alt="Lobby khách sạn" className="rounded-lg shadow-2xl z-10 relative"/>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-amber-400 rounded-lg -z-0"></div>
          </div>
        </div>
      </section>

      {/* 3. SECTION PHÒNG NỔI BẬT (FEATURED ROOMS) */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-blue-600 font-bold tracking-widest uppercase">Nghỉ Dưỡng</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Các Hạng Phòng Nổi Bật</h2>
            <p className="mt-4 text-lg text-gray-600">Chọn cho mình không gian nghỉ ngơi lý tưởng nhất, từ căn phòng ấm cúng đến các suite sang trọng có tầm nhìn tuyệt đẹp.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredRooms.map((room) => (
              <div key={room.id} className="bg-white rounded-xl shadow-md overflow-hidden border group hover:shadow-2xl transition-all duration-500">
                <div className="overflow-hidden h-64">
                    <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                  <p className="text-gray-600 mt-2 h-12 line-clamp-2">{room.description}</p>
                  <div className="flex justify-between items-center mt-6 border-t pt-4">
                    <span className="text-xl font-bold text-orange-600">{room.price} VNĐ <span className="text-sm text-gray-500 font-normal">/ đêm</span></span>
                    <Link to={`/booking/${room.id}`} className="bg-gray-900 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold text-sm transition transition-colors">
                      Đặt Ngay
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* 4. SECTION DỊCH VỤ TIỆN ÍCH */}
      <section className="py-20 px-4 bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold mb-16">Tiện Nghi & Dịch Vụ Vượt Trội</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {[
                    { icon: "🏊‍♂️", title: "Hồ Bơi Vô Cực", desc: "Tầm nhìn thành phố tuyệt đẹp." },
                    { icon: "🍽️", title: "Nhà Hàng 5 Sao", desc: "Ẩm thực Á - Âu tinh tế." },
                    { icon: "💆‍♀️", title: "Spa & Wellness", desc: "Thư giãn và phục hồi cơ thể." },
                    { icon: "🏋️‍♂️", title: "Phòng Gym 24/7", desc: "Trang thiết bị hiện đại nhất." },
                ].map(svc => (
                    <div key={svc.title} className="bg-blue-600/50 p-8 rounded-xl border border-blue-500 hover:bg-blue-800 transition duration-300">
                        <div className="text-6xl mb-4">{svc.icon}</div>
                        <h3 className="text-xl font-bold mb-1">{svc.title}</h3>
                        <p className="text-blue-100">{svc.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 5. SECTION ĐÁNH GIÁ (TESTIMONIALS) */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-blue-600 font-bold tracking-widest uppercase">Đánh Giá</span>
                <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Cảm Thấy Của Khách Hàng</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                {[
                    {name: "Chị Minh Thư", quote: "Gia đình tôi đã có một kỳ nghỉ tuyệt vời. Phòng VIP Panorama có view đẹp không thể tả, dịch vụ phòng rất nhanh và chu đáo.", avatar: "👩‍💼"},
                    {name: "Anh Hoàng Nam", quote: "Vị trí rất trung tâm, thuận tiện đi lại. Nhân viên lễ tân cực kỳ thân thiện và chuyên nghiệp. Ẩm thực nhà hàng cũng là một điểm cộng lớn.", avatar: "👨‍💻"},
                ].map(review => (
                    <div key={review.name} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex gap-6 items-start hover:shadow-xl transition transition-shadow">
                        <div className="text-5xl">{review.avatar}</div>
                        <div>
                            <div className="text-amber-400 mb-2">★★★★★</div>
                            <p className="text-lg text-gray-700 leading-relaxed italic">"{review.quote}"</p>
                            <p className="mt-4 font-bold text-gray-900 text-lg">- {review.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

    </div>
  );
}