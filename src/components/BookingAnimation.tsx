"use client";

export default function BookingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-12">
      <div className="flow-animation-container">
        <div className="step step-1">
          <span className="emoji">📅</span>
          <p className="text-sm font-semibold text-slate-900">Book</p>
        </div>

        <div className="arrow-horizontal">→</div>

        <div className="step step-2">
          <span className="emoji">⚙️</span>
          <p className="text-sm font-semibold text-slate-900">Schedule</p>
        </div>

        <div className="arrow-horizontal">→</div>

        <div className="step step-3">
          <span className="emoji">🔔</span>
          <p className="text-sm font-semibold text-slate-900">Notify</p>
        </div>

        <div className="arrow-horizontal">→</div>

        <div className="step step-4">
          <span className="emoji">✅</span>
          <p className="text-sm font-semibold text-slate-900">Confirm</p>
        </div>
      </div>

      <style jsx>{`
        .flow-animation-container {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          opacity: 0;
          animation: fadeUpFlow 4s ease-in-out infinite;
        }

        .step-1 {
          animation-delay: 0s;
        }

        .step-2 {
          animation-delay: 0.8s;
        }

        .step-3 {
          animation-delay: 1.6s;
        }

        .step-4 {
          animation-delay: 2.4s;
        }

        .emoji {
          font-size: 1.5rem;
        }

        .arrow-horizontal {
          color: #94a3b8;
          font-weight: 700;
          font-size: 1.25rem;
          opacity: 0;
          animation: fadeUpFlow 4s ease-in-out infinite;
        }

        @keyframes fadeUpFlow {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          20% {
            opacity: 1;
            transform: translateY(0);
          }
          80% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-8px);
          }
        }

        @media (max-width: 640px) {
          .arrow-horizontal {
            writing-mode: vertical-rl;
            text-orientation: mixed;
            margin: 0.5rem 0;
          }

          .flow-animation-container {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
