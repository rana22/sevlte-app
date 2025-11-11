<script lang="ts">
  export let images: { src: string; alt?: string }[] = [];
  export let loop = true;

  let index = 0;
  let startX = 0;
  let deltaX = 0;
  let dragging = false;

  const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, v));
  const goto = (i: number) => {
    if (!images.length) return;
    index = loop
      ? (i + images.length) % images.length
      : clamp(i, 0, images.length - 1);
  };
  const prev = () => goto(index - 1);
  const next = () => goto(index + 1);

  function onDown(e: PointerEvent | TouchEvent) {
    dragging = true;
    startX =
      "touches" in e ? e.touches[0].clientX : (e as PointerEvent).clientX;
    deltaX = 0;
  }
  function onMove(e: PointerEvent | TouchEvent) {
    if (!dragging) return;
    const x =
      "touches" in e ? e.touches[0].clientX : (e as PointerEvent).clientX;
    deltaX = x - startX;
  }
  function onUp() {
    if (!dragging) return;
    dragging = false;
    if (Math.abs(deltaX) > 50) deltaX < 0 ? next() : prev();
    deltaX = 0;
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };
</script>

<div
  class="carousel"
  tabindex="0"
  on:keydown={onKey}
  on:pointerdown={onDown}
  on:pointermove={onMove}
  on:pointerup={onUp}
  on:pointerleave={onUp}
  on:touchstart={onDown}
  on:touchmove={onMove}
  on:touchend={onUp}
>
  <div
    class="track"
    style="transform: translateX(calc(-100% * {index} + {deltaX}px));"
  >
    {#each images as image}
      <div class="slide">
        <img src={image.src} alt={image.alt || "image"} loading="lazy" />
      </div>
    {/each}
  </div>

  {#if images.length > 1}
    <div class="nav">
      <button class="btn" aria-label="Previous" on:click={prev}>‹</button>
      <button class="btn" aria-label="Next" on:click={next}>›</button>
    </div>
    <div class="dots">
      {#each images as _, i}
        <div
          class="dot {i === index ? 'active' : ''}"
          on:click={() => goto(i)}
        />
      {/each}
    </div>
  {/if}
</div>

<style>
  .carousel {
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    border: 1px solid #222;
    background: #0f0f12;
    user-select: none;
  }
  .track {
    display: flex;
    transition: transform 0.25s ease;
  }
  .slide {
    flex: 0 0 100%;
    display: grid;
    place-items: center;
    height: 520px;
  }
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
  .nav {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
  }
  .btn {
    background: rgba(17, 17, 19, 0.6);
    border: 1px solid #2a2a2f;
    width: 36px;
    height: 36px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    cursor: pointer;
  }
  .dots {
    position: absolute;
    bottom: 8px;
    left: 0;
    right: 0;
    display: flex;
    gap: 6px;
    justify-content: center;
  }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: #2a2a2f;
  }
  .dot.active {
    background: #5dd6a0;
  }
</style>
