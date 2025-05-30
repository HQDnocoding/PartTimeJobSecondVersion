import React from 'react';
import './Footer.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      {/* Loại bỏ .container, dùng full-width trực tiếp */}
      <section className="top-footer cb-section cb-section-border-bottom">
        <div className="row">
          {/* Logo */}
          {/* <div className="col-lg-12 logo">
            <img
              className="lazy-bg"
              src="https://static.ou.vn/themes/careerbuilder/img/logo.png"
              alt="Tuyển dụng & Tìm kiếm việc làm nhanh"
            />
          </div> */}

          {/* Cột Dành Cho Ứng Viên */}
          <FooterColumn
            title="Dành Cho Ứng Viên"
            links={[
              { label: 'Việc làm mới nhất', url: '#' },
              { label: 'CV Hay', url: '#' },
            ]}
          />

          {/* Cột Nhà Tuyển Dụng */}
          <FooterColumn
            title="Nhà Tuyển Dụng"
            links={[
              { label: 'Đăng Tuyển Dụng', url: '#' },
              { label: 'Tìm Hồ Sơ', url: '#' },
            ]}
          />

          {/* Trung Tâm Trợ Giúp */}
          <FooterColumn
            title="Trung tâm trợ giúp"
            links={[
              { label: 'Quy chế sàn giao dịch', url: '#' },
              { label: 'Điều khoản sử dụng', url: '#' },
              { label: 'Chính sách quyền riêng tư', url: '#' },
              { label: 'QT Giải Quyết Tranh Chấp', url: '#' },
              { label: 'Trợ giúp', url: '#' }
            ]}
          />

          {/* Website Đối Tác */}
          <FooterColumn
            title="Website Đối Tác"
            links={[
              { label: 'Vieclam.Tuoitre.vn', url: '#' },
              { label: 'VieclamIT.vn', url: '#' },
              { label: 'Liên Hệ', url: '#' }
            ]}
          />

          {/* Xây Dựng Sự Nghiệp */}
          <FooterColumn
            title="XÂY DỰNG SỰ NGHIỆP"
            links={[
              { label: 'Freelancer', url: '#' },
              { label: 'Thiết kế nội thất', url: '#' },
              { label: 'Nhân viên kinh doanh', url: '#' },
              { label: 'Administrator', url: '#' }
            ]}
          />
          
        </div>
      </section>

      {/* Bottom Footer */}
      <section className="bottom-footer">
        <div className="footer-content">
          <p>Trụ sở chính: 97 Võ Văn Tần, Phường 6, Quận 3 Thành Phố Hồ Chí Minh - Tel: (84.28) 3822 6060 </p>
          <p>Cơ sở 3: Khu Dân cư Nhơn Đức, Huyện Nhà Bè, Thành phố Hồ Chí Minh. - Tel: (84.24) 7305 6060 </p>
          <p>Email: contact@ou.edu.vn</p>
          <p>Copyright © 2024 - {currentYear} Nguyễn Trung Hậu vs Hứa Quang Đạt</p>
        </div>
      </section>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div className="col-lg-2 col-sm-6">
      <div className="footer-links">
        <div className="links-lbl">{title}</div>
        <ul>
          {links.map((link, idx) => (
            <li key={idx}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" title={link.label}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Footer;