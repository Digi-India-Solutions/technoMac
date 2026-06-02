import { useNavigate } from 'react-router-dom';
import logo from "../images/logo-chat.webp";

export default function Home() {
  const navigate = useNavigate();
  const login = sessionStorage.getItem("login");

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorative circles */}
      <div style={{
        position: 'absolute', width: 400, height: 400,
        borderRadius: '50%', top: -100, right: -100,
        background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300,
        borderRadius: '50%', bottom: -80, left: -80,
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 24,
        padding: '40px 36px',
        maxWidth: 420,
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
        position: 'relative',
        display:'flex',
        flexDirection:'column'
      }}>

        {/* Logo box */}
        <div style={{
          background: '#000',
          borderRadius: 16,
          padding: '7px 12px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 18,
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <img
            src={logo}
            alt="Technomac Logo"
            style={{ height: 92, width: 'auto', objectFit: 'contain', display: 'block' }}
          />
        </div>

        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(59,130,246,0.15)',
          border: '1px solid rgba(59,130,246,0.3)',
          borderRadius: 999,
          padding: '4px 14px',
          marginBottom: 16,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#60a5fa', display: 'inline-block',
            boxShadow: '0 0 6px #60a5fa',
          }} />
          <span style={{ color: '#93c5fd', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Dental Equipment Portal
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 32,
          fontWeight: 700,
          color: '#fff',
          margin: '0 0 10px',
          fontFamily: '"Pacifico", serif',
          letterSpacing: '-0.5px',
        }}>
          Technomac
        </h1>

        {/* Subtitle */}
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 0 32px', lineHeight: 1.6 }}>
          Advanced Dental Equipment &<br />Clinic Setup Solutions
        </p>

        {/* Divider */}
        <div style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          marginBottom: 28,
        }} />

        {/* CTA Button */}
        <button
          onClick={() => login ? navigate('/admin/dashboard') : navigate('/login')}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: '#fff',
            border: 'none',
            borderRadius: 14,
            padding: '14px 24px',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            boxShadow: '0 8px 24px rgba(37,99,235,0.35)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 28px rgba(37,99,235,0.45)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(37,99,235,0.35)';
          }}
        >
          <i className="ri-dashboard-line" style={{ fontSize: 18 }}></i>
          <span>Access Admin Panel</span>
          <i className="ri-arrow-right-line" style={{ fontSize: 18 }}></i>
        </button>

        {/* Footer */}
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, marginTop: 24, marginBottom: 0 }}>
          © {new Date().getFullYear()} Technomac. All rights reserved.
        </p>
      </div>
    </div>
  );
}