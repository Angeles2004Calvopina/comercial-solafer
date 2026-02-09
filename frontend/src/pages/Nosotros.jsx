import React from "react";
import {
  FaClock,
  FaMapMarkerAlt,
  FaRocket,
  FaShieldAlt,
  FaStar,
  FaEye,
  FaUsers,
  FaShoppingBag
} from "react-icons/fa";
import "../styles/Nosotros.css";

function Nosotros() {
  return (
    <div className="about-modern-container">
      {/* HERO SECTION */}
      <section className="hero-minimal text-center">
        <div className="container py-5">
          <span className="badge-welcome">CONÓCENOS</span>
          <h1 className="hero-title">Comercial Solafer</h1>
          <p className="hero-subtitle">
            Tecnología, suministros de oficina y confianza para potenciar tu éxito.
          </p>
        </div>
      </section>

      {/* STATS BAR (NUEVO) */}
      <section className="container stats-bar">
        <div className="row text-center">
          <div className="col-4">
            <h3 className="stat-number">10+</h3>
            <p className="stat-label">Años de Trayectoria</p>
          </div>
          <div className="col-4">
            <h3 className="stat-number">100%</h3>
            <p className="stat-label">Garantía Real</p>
          </div>
          <div className="col-4">
            <h3 className="stat-number">Riobamba</h3>
            <p className="stat-label">Sede Central</p>
          </div>
        </div>
      </section>

      {/* VALORES / MISIÓN / VISIÓN */}
      <section className="container values-section">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="value-card">
              <div className="icon-wrapper primary">
                <FaRocket />
              </div>
              <h5>Misión</h5>
              <p>
                Impulsar la productividad de nuestros clientes ofreciendo tecnología 
                y artículos de oficina con la mejor relación calidad-precio.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="value-card">
              <div className="icon-wrapper success">
                <FaEye />
              </div>
              <h5>Visión</h5>
              <p>
                Ser el referente principal en Riobamba para soluciones tecnológicas 
                y suministros, reconocidos por nuestra integridad y servicio.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="value-card">
              <div className="icon-wrapper warning">
                <FaShieldAlt />
              </div>
              <h5>Garantía</h5>
              <p>
                No solo vendemos productos; ofrecemos el respaldo y la seguridad de 
                que cada compra cuenta con soporte técnico especializado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HISTORIA + UBICACIÓN */}
      <section className="container info-section">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <h2 className="section-title">
              Tu aliado estratégico en <span>cada proyecto</span>
            </h2>
            <p className="section-text">
              En <strong>Comercial Solafer</strong> entendemos que cada compra es 
              una inversión para tu futuro. Desde el estudiante que necesita su 
              primera laptop hasta la empresa que requiere equipamiento completo, 
              estamos aquí para asesorarte.
            </p>
            <div className="features-list">
                <div className="f-item"><FaStar /> Productos 100% Originales</div>
                <div className="f-item"><FaUsers /> Atención personalizada</div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="info-card-modern">
              <div className="info-header">
                <span className="badge-local">Orgullosamente Riobambeños 🇪🇨</span>
              </div>
              
              <div className="info-body">
                <div className="info-row-modern">
                  <div className="info-icon"><FaMapMarkerAlt /></div>
                  <div>
                    <h6>Ubicación</h6>
                    <p>Otto Arosemena Gómez y Juan de Dios Martínez</p>
                  </div>
                </div>

                <div className="info-row-modern">
                  <div className="info-icon"><FaClock /></div>
                  <div>
                    <h6>Horario de Atención</h6>
                    <p>Lunes a Viernes: 08:00 – 20:00</p>
                    <p>Sábados: 09:00 – 16:00</p>
                  </div>
                </div>
              </div>
              
              <a href="https://wa.me/tu-numero" className="btn-contact-info">
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION (NUEVO) */}
      <section className="cta-section text-center py-5">
        <div className="container">
            <h3>¿Listo para equiparte con lo mejor?</h3>
            <p>Explora nuestro catálogo de productos y descubre nuestras ofertas.</p>
            <button className="btn-primary-solafer">Ver Productos <FaShoppingBag style={{marginLeft: '8px'}}/></button>
        </div>
      </section>
    </div>
  );
}

export default Nosotros;