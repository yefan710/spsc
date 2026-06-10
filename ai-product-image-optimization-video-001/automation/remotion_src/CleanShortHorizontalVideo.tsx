import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  Video,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {PRODUCT_CONFIGS, productAsset, type ProductConfig, type ProductId} from "./productData";

type CleanShortHorizontalVideoProps = {
  productId?: string;
  openingProductIds?: ProductId[];
};

export const CLEAN_SHORT_HORIZONTAL_FPS = 30;
export const CLEAN_SHORT_HORIZONTAL_DURATION = 25 * CLEAN_SHORT_HORIZONTAL_FPS;

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const titleFont = '"PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", Arial, sans-serif';

const beforePath = (config: ProductConfig) => productAsset(config.id, "before.jpg");
const slotPath = (config: ProductConfig, slot: number) => productAsset(config.id, `after_slot${slot}.jpg`);

const EffectCard = ({
  src,
  left,
  top,
  width,
  height,
  delay,
  rotate = 0,
  active = false,
  generated = false,
  fromScale = 0.9,
  zIndex = 1,
}: {
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
  delay: number;
  rotate?: number;
  active?: boolean;
  generated?: boolean;
  fromScale?: number;
  zIndex?: number;
}) => {
  const frame = useCurrentFrame();
  const enter = spring({
    frame: frame - delay,
    fps: CLEAN_SHORT_HORIZONTAL_FPS,
    config: {damping: 19, stiffness: 150},
  });
  const lift = interpolate(enter, [0, 1], [36, 0]);
  const overshootAt = generated ? 30 : 18;
  const settleAt = generated ? 48 : 34;
  const scale = interpolate(frame, [delay, delay + overshootAt, delay + settleAt], [fromScale, 1.08, 1], clamp);
  const borderColor = active ? "#b7ff39" : generated ? "rgba(183,255,57,0.72)" : "rgba(255,255,255,0.92)";

  return (
    <div
      style={{
        position: "absolute",
        zIndex,
        left,
        top,
        width,
        height,
        overflow: "hidden",
        borderRadius: 18,
        backgroundColor: "#f3eee7",
        border: `${active ? 5 : 3}px solid ${borderColor}`,
        boxShadow:
          active || generated
            ? "0 28px 80px rgba(183,255,57,0.2), 0 22px 64px rgba(0,0,0,0.32)"
            : "0 24px 70px rgba(0,0,0,0.34)",
        opacity: interpolate(enter, [0, 0.22, 1], [0, 1, 1], clamp),
        transform: `translateY(${lift}px) rotate(${rotate}deg) scale(${scale})`,
      }}
    >
      <Img src={staticFile(src)} style={{width: "100%", height: "100%", objectFit: "cover"}} />
    </div>
  );
};

const RowTransformCue = ({top, delay}: {top: number; delay: number}) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [delay + 18, delay + 52], [0, 1], clamp);
  const pulse = interpolate(Math.sin(frame / 6), [-1, 1], [0, 1]);

  return (
    <div style={{position: "absolute", left: 294, top, width: 108, height: 54}}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 25,
          width: 74 * draw,
          height: 4,
          borderRadius: 99,
          background: "linear-gradient(90deg, rgba(183,255,57,0), #b7ff39)",
          boxShadow: "0 0 28px rgba(183,255,57,0.44)",
        }}
      />
      {[0, 1].map((index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: 26 + index * 28,
            top: 17,
            width: 18,
            height: 18,
            borderRadius: "50%",
            backgroundColor: "#b7ff39",
            opacity: interpolate(frame, [delay + 24 + index * 8, delay + 34 + index * 8], [0, 0.7 + pulse * 0.3], clamp),
            boxShadow: "0 0 34px rgba(183,255,57,0.72)",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          right: 8,
          top: 13,
          width: 0,
          height: 0,
          borderTop: "13px solid transparent",
          borderBottom: "13px solid transparent",
          borderLeft: "20px solid #b7ff39",
          opacity: draw,
          filter: "drop-shadow(0 0 18px rgba(183,255,57,0.6))",
        }}
      />
    </div>
  );
};

const DEFAULT_OPENING_PRODUCT_IDS: ProductId[] = [
  "3822609501081698334",
  "3820572380753953571",
  "3822608064423526853",
];
const FALLBACK_PRODUCT_ID: ProductId = "3822609501081698334";

const OpeningProductRow = ({
  config,
  index,
  top,
}: {
  config: ProductConfig;
  index: number;
  top: number;
}) => {
  const frame = useCurrentFrame();
  const delay = index * 18;
  const slots = config.showSlots.slice(0, 5);
  const rowEnter = spring({
    frame: frame - delay,
    fps: CLEAN_SHORT_HORIZONTAL_FPS,
    config: {damping: 20, stiffness: 105},
  });

  const rowOpacity = interpolate(rowEnter, [0, 0.22, 1], [0, 1, 1], clamp);
  const rowLift = interpolate(rowEnter, [0, 1], [22, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: 34,
        top,
        width: 1206,
        height: 302,
        opacity: rowOpacity,
        transform: `translateY(${rowLift}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 10,
          right: 0,
          top: 282,
          height: 2,
          background: "linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,0.14), rgba(0,0,0,0))",
        }}
      />
      <EffectCard
        src={beforePath(config)}
        left={20}
        top={40}
        width={214}
        height={214}
        delay={delay}
        rotate={index === 1 ? 1.1 : -1}
        active
      />
      <RowTransformCue top={120} delay={delay} />
      <EffectCard
        src={slotPath(config, slots[0] ?? 1)}
        left={406}
        top={18}
        width={250}
        height={250}
        delay={delay + 34}
        rotate={index === 1 ? -0.6 : 0.7}
        generated
        fromScale={3.05}
        zIndex={10}
      />
      {(slots.length >= 5 ? slots.slice(1, 5) : [2, 3, 4, 5]).map((slot, smallIndex) => (
        <EffectCard
          key={`${config.id}-${slot}`}
          src={slotPath(config, slot)}
          left={690 + smallIndex * 132}
          top={74}
          width={122}
          height={122}
          delay={delay + 54 + smallIndex * 4}
          rotate={smallIndex % 2 === 0 ? -1.2 : 1.1}
          generated
          fromScale={3.4}
          zIndex={8 - smallIndex}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 682,
          top: 204,
          width: 558,
          height: 16,
          borderRadius: 99,
          background:
            "linear-gradient(90deg, rgba(183,255,57,0.56), rgba(255,255,255,0.34), rgba(183,255,57,0))",
          opacity: interpolate(frame, [delay + 94, delay + 150], [0, 0.72], clamp),
        }}
      />
    </div>
  );
};

const ScreenVideo = ({
  src,
  startFrom = 0,
  scale = 1,
  x = 0,
  y = 0,
  dim = 0,
}: {
  src: string;
  startFrom?: number;
  scale?: number;
  x?: number;
  y?: number;
  dim?: number;
}) => (
  <AbsoluteFill style={{backgroundColor: "#050505", overflow: "hidden"}}>
    <Video
      src={staticFile(src)}
      muted
      startFrom={startFrom}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        transformOrigin: "center center",
      }}
    />
    {dim > 0 ? <div style={{position: "absolute", inset: 0, backgroundColor: `rgba(0,0,0,${dim})`}} /> : null}
  </AbsoluteFill>
);

const ReferenceStyleOpening = ({productIds = DEFAULT_OPENING_PRODUCT_IDS}: {productIds?: ProductId[]}) => {
  const frame = useCurrentFrame();
  const gridShift = interpolate(frame, [0, 180], [0, -44], clamp);
  const titleEnter = spring({
    frame: frame - 18,
    fps: CLEAN_SHORT_HORIZONTAL_FPS,
    config: {damping: 18, stiffness: 130},
  });

  return (
    <AbsoluteFill style={{backgroundColor: "#050505", overflow: "hidden"}}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1280,
          height: "100%",
          background: "linear-gradient(90deg, #f6f2ea 0%, #eee8dc 46%, #e5dfd5 74%, rgba(229,223,213,0) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 1280,
          top: 0,
          width: 640,
          height: "100%",
          background: "#151515",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -220,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.18) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.18) 2px, transparent 2px)",
            backgroundSize: "72px 72px",
            transform: `perspective(760px) rotateX(58deg) translateY(${gridShift}px) scale(1.36)`,
            transformOrigin: "center 70%",
            opacity: 0.7,
          }}
        />
        <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at 58% 46%, rgba(255,255,255,0.08), rgba(0,0,0,0.15) 38%, rgba(0,0,0,0.5) 100%)"}} />
        <div
          style={{
            position: "absolute",
            left: 34,
            top: 198,
            width: 558,
            height: 424,
            borderRadius: 28,
            background: "linear-gradient(180deg, rgba(0,0,0,0.46), rgba(0,0,0,0.18))",
            boxShadow: "0 24px 80px rgba(0,0,0,0.38)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 58,
            top: 236,
            color: "#fff",
            fontFamily: titleFont,
            fontSize: 106,
            lineHeight: 1.06,
            fontWeight: 800,
            letterSpacing: 0,
            textShadow: "0 8px 28px rgba(0,0,0,0.72), 0 0 1px rgba(255,255,255,0.8)",
            transform: `translateY(${interpolate(titleEnter, [0, 1], [30, 0])}px) scale(${interpolate(titleEnter, [0, 1], [0.92, 1])})`,
            opacity: interpolate(titleEnter, [0, 0.2, 1], [0, 1, 1], clamp),
          }}
        >
          <div>AI一键优化</div>
          <div>商品套图</div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 62,
            top: 490,
            color: "#b7ff39",
            fontFamily: titleFont,
            fontSize: 64,
            lineHeight: 1.08,
            fontWeight: 750,
            textShadow: "0 8px 26px rgba(0,0,0,0.74), 0 0 22px rgba(183,255,57,0.16)",
            opacity: interpolate(frame, [32, 46], [0, 1], clamp),
          }}
        >
          批量生成全套视觉
        </div>
      </div>
      {productIds.map((id, index) => (
        <OpeningProductRow key={id} config={PRODUCT_CONFIGS[id]} index={index} top={48 + index * 318} />
      ))}
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 18,
          color: "#171717",
          fontFamily: titleFont,
          fontSize: 40,
          lineHeight: 1,
          fontWeight: 800,
          letterSpacing: 0,
          textShadow: "0 3px 12px rgba(255,255,255,0.72)",
        }}
      >
        原图
      </div>
      <div
        style={{
          position: "absolute",
          left: 526,
          top: 18,
          color: "#171717",
          fontFamily: titleFont,
          fontSize: 40,
          lineHeight: 1,
          fontWeight: 800,
          letterSpacing: 0,
          textShadow: "0 3px 12px rgba(255,255,255,0.72)",
        }}
      >
        生成效果图
      </div>
    </AbsoluteFill>
  );
};

const PureOperationA = () => {
  const frame = useCurrentFrame();
  return (
    <ScreenVideo
      src="assets/screen/scene03_04_wide_operation.mp4"
      startFrom={0}
      scale={interpolate(frame, [0, 210], [1.005, 1.03], clamp)}
      x={interpolate(frame, [0, 210], [0, -24], clamp)}
    />
  );
};

const PureOperationB = () => {
  const frame = useCurrentFrame();
  return (
    <ScreenVideo
      src="assets/screen/scene03_04_wide_operation.mp4"
      startFrom={180}
      scale={interpolate(frame, [0, 210], [1.01, 1.04], clamp)}
      x={interpolate(frame, [0, 210], [-4, -28], clamp)}
    />
  );
};

const ResultThumb = ({src, left, top, size}: {src: string; left: number; top: number; size: number}) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width: size,
      height: size,
      borderRadius: 14,
      overflow: "hidden",
      border: "2px solid rgba(183,255,57,0.72)",
      boxShadow: "0 14px 38px rgba(0,0,0,0.18)",
      backgroundColor: "#f5f1eb",
    }}
  >
    <Img src={staticFile(src)} style={{width: "100%", height: "100%", objectFit: "cover"}} />
  </div>
);

const ViewEffectsAndEnd = ({productIds = DEFAULT_OPENING_PRODUCT_IDS}: {productIds?: ProductId[]}) => {
  const frame = useCurrentFrame();
  const visibleProductIds = productIds.length > 0 ? productIds : DEFAULT_OPENING_PRODUCT_IDS;
  const activeIndex = Math.min(visibleProductIds.length - 1, Math.floor(frame / 70));
  const activeProductId = visibleProductIds[activeIndex] ?? FALLBACK_PRODUCT_ID;
  const activeConfig = PRODUCT_CONFIGS[activeProductId];
  const activeSlot = activeConfig.showSlots[Math.min(4, Math.floor((frame % 70) / 14))] ?? 1;

  return (
    <AbsoluteFill style={{backgroundColor: "#f4efe6", overflow: "hidden", fontFamily: titleFont}}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, #f4efe6 0%, #f8f5ef 64%, #101010 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 62,
          top: 56,
          width: 1218,
          height: 972,
          borderRadius: 24,
          backgroundColor: "rgba(255,255,255,0.72)",
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 28px 80px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 36,
            top: 28,
            color: "#1c1c1c",
            fontSize: 38,
            fontWeight: 850,
          }}
        >
          查看生成效果
        </div>
        <div
          style={{
            position: "absolute",
            right: 36,
            top: 34,
            color: "#5a5a5a",
            fontSize: 24,
            fontWeight: 650,
          }}
        >
          3 个商品 / 每个商品 5 张主图
        </div>
        {visibleProductIds.map((id, index) => {
          const config = PRODUCT_CONFIGS[id];
          const rowTop = 116 + index * 282;
          const rowEnter = spring({
            frame: frame - index * 18,
            fps: CLEAN_SHORT_HORIZONTAL_FPS,
            config: {damping: 18, stiffness: 120},
          });
          return (
            <div
              key={id}
              style={{
                position: "absolute",
                left: 36,
                top: rowTop,
                width: 1146,
                height: 240,
                opacity: interpolate(rowEnter, [0, 0.25, 1], [0, 1, 1], clamp),
                transform: `translateY(${interpolate(rowEnter, [0, 1], [24, 0])}px)`,
              }}
            >
              <ResultThumb src={beforePath(config)} left={0} top={26} size={166} />
              <div
                style={{
                  position: "absolute",
                  left: 202,
                  top: 96,
                  width: 86,
                  height: 5,
                  borderRadius: 99,
                  background: "linear-gradient(90deg, rgba(183,255,57,0), #b7ff39)",
                  boxShadow: "0 0 18px rgba(183,255,57,0.45)",
                }}
              />
              {config.showSlots.slice(0, 5).map((slot, slotIndex) => (
                <ResultThumb
                  key={`${id}-${slot}`}
                  src={slotPath(config, slot)}
                  left={324 + slotIndex * 156}
                  top={12 + (slotIndex % 2) * 18}
                  size={142}
                />
              ))}
              <div
                style={{
                  position: "absolute",
                  left: 326,
                  top: 178,
                  width: 748,
                  height: 12,
                  borderRadius: 99,
                  background:
                    "linear-gradient(90deg, rgba(183,255,57,0.72), rgba(255,255,255,0.2), rgba(183,255,57,0))",
                  opacity: 0.55,
                }}
              />
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          right: 68,
          top: 116,
          width: 520,
          height: 752,
          borderRadius: 28,
          overflow: "hidden",
          backgroundColor: "#f5f1eb",
          border: "4px solid rgba(183,255,57,0.82)",
          boxShadow: "0 34px 100px rgba(0,0,0,0.48), 0 0 44px rgba(183,255,57,0.2)",
          transform: `scale(${interpolate(Math.sin(frame / 18), [-1, 1], [0.985, 1.015])})`,
        }}
      >
        <Img src={staticFile(slotPath(activeConfig, activeSlot))} style={{width: "100%", height: "100%", objectFit: "cover"}} />
      </div>
    </AbsoluteFill>
  );
};

export const CleanShortHorizontalVideo = ({productId, openingProductIds}: CleanShortHorizontalVideoProps) => {
  void productId;
  return (
    <AbsoluteFill style={{width: 1920, height: 1080, backgroundColor: "#050505", overflow: "hidden"}}>
      <Sequence from={0} durationInFrames={180}>
        <ReferenceStyleOpening productIds={openingProductIds} />
      </Sequence>
      <Sequence from={180} durationInFrames={180}>
        <PureOperationA />
      </Sequence>
      <Sequence from={360} durationInFrames={180}>
        <PureOperationB />
      </Sequence>
      <Sequence from={540} durationInFrames={210}>
        <ViewEffectsAndEnd productIds={openingProductIds} />
      </Sequence>
    </AbsoluteFill>
  );
};
