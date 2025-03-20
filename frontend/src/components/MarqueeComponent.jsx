import React, { useEffect } from "react";

const MarqueeEffect = () => {
  useEffect(() => {
    document.querySelectorAll(".marquee_text").forEach((text) => {
      text.style.animation = "marquee 16s linear infinite";
    });
  }, []);

  const containerStyle = {
    width: "100%",
    padding: "2em 1em",
    position: "relative",
    overflow: "hidden",
    zIndex: -1,
    whiteSpace: "nowrap",
  };

  const marqueeStyle = {
    display: "flex",
    alignItems: "center",
    width: "100%",
    overflow: "hidden",
    fontSize: "4em",
    fontWeight: "bold",
  };

  const marqueeTextStyle = {
    display: "inline-block",
    whiteSpace: "nowrap",
    minWidth: "100%",
    animation: "marquee 16s linear infinite",
  };

  const keyframesStyle = `
    @keyframes marquee {
      from { transform: translateX(100%); }
      to { transform: translateX(-100%); }
    }
    @media (max-width: 700px) {
      .marquee_text {
        font-size: 2rem !important; /* Smaller text for mobile */
        padding: 0 0;
      }
    }
  `;

  return (
    <div style={containerStyle}>
      <style>{keyframesStyle}</style>
      <div style={marqueeStyle}>
        <p className="marquee_text font-bebas" style={marqueeTextStyle}>
          Fashion & Tech<span className="text-[#f46530]">.</span> One
          Destination — UniCart<span className="text-[#f46530]">.</span>
        </p>
      </div>
    </div>
  );
};

export default MarqueeEffect;
