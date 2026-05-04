import { AlertTriangle, ShieldCheck, Link2, KeyRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { DetectionResult } from "@/lib/phishingDetector";

export const ResultPanel = ({ result }: { result: DetectionResult }) => {
  const isPhish = result.verdict === "Phishing";
  const confPct = Math.round(result.confidence * 100);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <Card
        className={`relative overflow-hidden p-6 scanline border-2 ${
          isPhish
            ? "bg-background border-danger shadow-neon-danger"
            : "bg-background border-safe shadow-neon-safe"
        }`}
      >
        <div className="flex items-start gap-4 relative">
          {isPhish ? (
            <AlertTriangle className="w-10 h-10 shrink-0 text-danger animate-flicker" />
          ) : (
            <ShieldCheck className="w-10 h-10 shrink-0 text-safe" />
          )}
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">// VERDICT</div>
            <div
              className={`text-3xl font-display font-black tracking-widest uppercase ${
                isPhish ? "text-danger text-glow-danger" : "text-safe text-glow-safe"
              }`}
            >
              [{result.verdict}]
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Progress
                value={confPct}
                className="h-2 bg-white/25 [&>div]:bg-white"
              />
              <span className="text-sm font-medium w-12 text-right">
                {confPct}%
              </span>
            </div>
            <div className="text-xs opacity-90 mt-1">Confidence</div>
          </div>
        </div>
      </Card>

      <Card className="p-5 shadow-card">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-primary" />
          Why
        </h3>
        <ul className="space-y-1.5 text-sm">
          {result.reasons.map((r, i) => (
            <li key={i} className="flex gap-2">
              <span className={isPhish ? "text-danger" : "text-safe"}>•</span>
              <span className="text-foreground/80">{r}</span>
            </li>
          ))}
        </ul>
      </Card>

      {result.urls.length > 0 && (
        <Card className="p-5 shadow-card">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-primary" />
            URLs found ({result.urls.length})
          </h3>
          <div className="space-y-2">
            {result.urls.map((u, i) => {
              const flags = [
                u.suspiciousTld && "suspicious TLD",
                u.hasDigit && "digits in domain",
                u.manyDots && "many subdomains",
                u.ipBased && "raw IP",
                u.punycode && "punycode",
              ].filter(Boolean) as string[];
              return (
                <div
                  key={i}
                  className="rounded-md border border-border bg-secondary/40 p-3"
                >
                  <div className="font-mono text-xs break-all">{u.url}</div>
                  {flags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {flags.map((f) => (
                        <Badge
                          key={f}
                          variant="outline"
                          className="text-[10px] border-danger/40 text-danger"
                        >
                          {f}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {result.matchedKeywords.length > 0 && (
        <Card className="p-5 shadow-card">
          <h3 className="font-semibold mb-3">Suspicious keywords</h3>
          <div className="flex flex-wrap gap-1.5">
            {result.features.suspiciousWordHits.map((h) => (
              <Badge
                key={h.word}
                variant="secondary"
                className="bg-warn/15 text-warn-foreground border border-warn/30"
              >
                {h.word}
                {h.count > 1 ? ` ×${h.count}` : ""}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-5 shadow-card">
        <h3 className="font-semibold mb-3">Extracted features</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <Stat label="URLs" value={result.features.urlCount} />
          <Stat label="Suspicious URLs" value={result.features.suspiciousUrlCount} />
          <Stat label="Keyword hits" value={result.features.suspiciousWordTotal} />
          <Stat label="Exclamations" value={result.features.exclamations} />
          <Stat label="Upper ratio" value={`${(result.features.upperRatio * 100).toFixed(0)}%`} />
          <Stat label="Length" value={result.features.length} />
          <Stat label="Score (logit)" value={result.score.toFixed(2)} />
          <Stat label="Confidence" value={`${confPct}%`} />
        </div>
      </Card>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-md bg-secondary/50 p-3">
    <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
      {label}
    </div>
    <div className="text-lg font-semibold tabular-nums mt-0.5">{value}</div>
  </div>
);
