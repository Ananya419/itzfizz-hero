"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HEADLINE = "WELCOME ITZFIZZ";

const stats = [
  {
    id: "box1",
    value: "58%",
    label: "Increase in pick up point use",
    bgColor: "#def54f",
    textColor: "#111",
  },
  {
    id: "box2",
    value: "23%",
    label: "Decreased in customer phone calls",
    bgColor: "#6ac9ff",
    textColor: "#111",
  },
  {
    id: "box3",
    value: "27%",
    label: "Increase in pick up point use",
    bgColor: "#2a2a2a",
    textColor: "#fff",
  },
  {
    id: "box4",
    value: "40%",
    label: "Decreased in customer phone calls",
    bgColor: "#fa7328",
    textColor: "#111",
  },
];

export default function Home() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const roadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const car = carRef.current;
    const trail = trailRef.current;
    const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[];
    const road = roadRef.current;
    const section = sectionRef.current;

    if (!car || !trail || !road || !section) return;

    // Initial page-load animation: staggered letter reveal
    gsap.set(letters, { opacity: 0.12 });
    gsap.fromTo(
      letters,
      { y: 20 },
      {
        y: 0,
        duration: 0.5,
        stagger: 0.04,
        ease: "power2.out",
        delay: 0.2,
      }
    );

    // Dimensions
    const roadWidth = road.offsetWidth;
    const carSize = 150;
    const endX = roadWidth - carSize;

    // Get letter center positions relative to road
    const roadRect = road.getBoundingClientRect();
    const letterPositions = letters.map((l) => {
      const rect = l.getBoundingClientRect();
      return rect.left - roadRect.left + rect.width / 2;
    });

    // Create main timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        pin: trackRef.current,
      },
    });

    // Animate car across road (0% to 60% of timeline)
    tl.to(
      car,
      {
        x: endX,
        ease: "none",
        duration: 1,
        onUpdate: function () {
          const carX = gsap.getProperty(car, "x") as number;
          const carCenter = carX + carSize / 2;

          // Reveal letters as car passes them
          letters.forEach((letter, i) => {
            if (carCenter >= letterPositions[i]) {
              gsap.to(letter, { opacity: 1, duration: 0.2, overwrite: true });
            } else {
              gsap.to(letter, {
                opacity: 0.12,
                duration: 0.2,
                overwrite: true,
              });
            }
          });

          // Trail follows car
          gsap.set(trail, { width: carCenter });
        },
      },
      0
    );

    // Animate stat cards appearing (staggered during 20%-80% of timeline)
    stats.forEach((stat, i) => {
      tl.fromTo(
        `#${stat.id}`,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        },
        0.2 + i * 0.15
      );
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <main>
      {/* Hero scroll section — tall for scroll distance */}
      <div ref={sectionRef} style={{ height: "250vh", position: "relative" }}>
        {/* Pinned track */}
        <div
          ref={trackRef}
          style={{
            height: "100vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#d1d1d1",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Road / Track */}
          <div
            ref={roadRef}
            style={{
              position: "relative",
              width: "100vw",
              height: "200px",
              backgroundColor: "#1e1e1e",
              overflow: "hidden",
            }}
          >
            {/* Car — using a div with inline styles for reliable rotation */}
            <div
              ref={carRef}
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: `${150}px`,
                height: "200px",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/itzfizz-hero/car.svg"
                alt="Sports car top view"
                style={{
                  width: "150px",
                  height: "auto",
                }}
              />
            </div>

            {/* Green trail */}
            <div
              ref={trailRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "200px",
                backgroundColor: "#45db7d",
                zIndex: 1,
                width: 0,
              }}
            />

            {/* Headline letters */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "5%",
                transform: "translateY(-50%)",
                zIndex: 5,
                display: "flex",
                gap: "0.3rem",
                fontSize: "clamp(2rem, 6vw, 7rem)",
                fontWeight: 800,
                userSelect: "none",
                letterSpacing: "0.15em",
              }}
            >
              {HEADLINE.split("").map((char, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    lettersRef.current[i] = el;
                  }}
                  style={{
                    color: "#111",
                    opacity: 0,
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </div>
          </div>

          {/* Stat Cards */}
          <div
            id="box1"
            style={{
              position: "absolute",
              top: "5%",
              right: "30%",
              backgroundColor: stats[0].bgColor,
              color: stats[0].textColor,
              opacity: 0,
              padding: "24px 30px",
              borderRadius: "12px",
              zIndex: 5,
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
          >
            <span style={{ fontSize: "3.5rem", fontWeight: 600 }}>
              {stats[0].value}
            </span>
            <span
              style={{
                fontSize: "1rem",
                fontWeight: 500,
                maxWidth: "180px",
              }}
            >
              {stats[0].label}
            </span>
          </div>

          <div
            id="box2"
            style={{
              position: "absolute",
              bottom: "5%",
              right: "35%",
              backgroundColor: stats[1].bgColor,
              color: stats[1].textColor,
              opacity: 0,
              padding: "24px 30px",
              borderRadius: "12px",
              zIndex: 5,
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
          >
            <span style={{ fontSize: "3.5rem", fontWeight: 600 }}>
              {stats[1].value}
            </span>
            <span
              style={{
                fontSize: "1rem",
                fontWeight: 500,
                maxWidth: "180px",
              }}
            >
              {stats[1].label}
            </span>
          </div>

          <div
            id="box3"
            style={{
              position: "absolute",
              top: "5%",
              right: "10%",
              backgroundColor: stats[2].bgColor,
              color: stats[2].textColor,
              opacity: 0,
              padding: "24px 30px",
              borderRadius: "12px",
              zIndex: 5,
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
          >
            <span style={{ fontSize: "3.5rem", fontWeight: 600 }}>
              {stats[2].value}
            </span>
            <span
              style={{
                fontSize: "1rem",
                fontWeight: 500,
                maxWidth: "180px",
              }}
            >
              {stats[2].label}
            </span>
          </div>

          <div
            id="box4"
            style={{
              position: "absolute",
              bottom: "5%",
              right: "12.5%",
              backgroundColor: stats[3].bgColor,
              color: stats[3].textColor,
              opacity: 0,
              padding: "24px 30px",
              borderRadius: "12px",
              zIndex: 5,
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
          >
            <span style={{ fontSize: "3.5rem", fontWeight: 600 }}>
              {stats[3].value}
            </span>
            <span
              style={{
                fontSize: "1rem",
                fontWeight: 500,
                maxWidth: "180px",
              }}
            >
              {stats[3].label}
            </span>
          </div>
        </div>
      </div>

      {/* Content sections below hero */}
      <section
        style={{
          backgroundColor: "#121212",
          padding: "96px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1024px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "24px",
            }}
          >
            Driving Digital Excellence
          </h2>
          <p
            style={{
              fontSize: "1.15rem",
              color: "#999",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            At Itzfizz Digital, we transform businesses through innovative web
            solutions, cutting-edge design, and data-driven strategies that
            deliver measurable results.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "32px",
            maxWidth: "1024px",
            margin: "64px auto 0",
          }}
        >
          {[
            {
              icon: "🚀",
              title: "Performance",
              desc: "Lightning-fast websites optimized for speed and conversion.",
            },
            {
              icon: "🎨",
              title: "Design",
              desc: "Premium UI/UX design that captures attention and drives engagement.",
            },
            {
              icon: "📈",
              title: "Growth",
              desc: "Data-driven strategies that scale your digital presence.",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: "32px",
                borderRadius: "16px",
                backgroundColor: "#1e1e1e",
                border: "1px solid #2a2a2a",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#45db7d";
                e.currentTarget.style.boxShadow =
                  "0 0 30px rgba(69,219,125,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#2a2a2a";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>
                {item.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: "12px",
                }}
              >
                {item.title}
              </h3>
              <p style={{ color: "#999", lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#0a0a0a",
          padding: "48px 24px",
          borderTop: "1px solid #1e1e1e",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
          Itzfizz Digital
        </p>
        <p style={{ color: "#666", fontSize: "0.85rem" }}>
          &copy; 2026 Itzfizz Digital. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
