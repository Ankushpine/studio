"use client"

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-background">
      <div className="relative h-full w-full">
        <div
          className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/20 opacity-50"
          style={{ animation: "blob-bounce 15s infinite ease-in-out" }}
        />
        <div
          className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent/20 opacity-50"
          style={{ animation: "blob-bounce 12s infinite ease-in-out" }}
        />
         <div className="absolute inset-0 bg-background/80 backdrop-blur-2xl" />
      </div>
    </div>
  )
}
