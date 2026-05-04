import { useMemo, useState } from "react";
import { Shield, Sparkles, Brain, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { detectPhishing, MODEL_METRICS } from "@/lib/phishingDetector";
import { ResultPanel } from "@/components/ResultPanel";
import { ConfusionMatrix } from "@/components/ConfusionMatrix";

const SAMPLES: { label: string; text: string }[] = [
  {
    label: "Phishing — bank alert",
    text: "URGENT: Your PayPal account has been suspended due to unusual activity. Verify now at http://secure-paypa1.com/login within 24 hours to avoid permanent closure!",
  },
  {
    label: "Phishing — package",
    text: "DHL: your package is on hold. Customs fee $2.99 due. Pay immediately: http://dhl-tracking-help.tk/dhl-fee",
  },
  {
    label: "Safe — colleague",
    text: "Hi Sam, just confirming our meeting tomorrow at 10am to review the Q3 roadmap. Let me know if anything changes.",
  },
  {
    label: "Safe — order",
    text: "Your Amazon order #112-3344 has shipped and will arrive Tuesday. Track at https://amazon.com/orders",
  },
];

const Index = () => {
  const [text, setText] = useState("");
  const result = useMemo(
    () => (text.trim().length > 0 ? detectPhishing(text) : null),
    [text]
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-primary/30 bg-background/70 backdrop-blur-md sticky top-0 z-10">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-md bg-background neon-border grid place-items-center shadow-glow animate-flicker">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-display font-bold tracking-widest text-primary text-glow uppercase text-sm">
                MailGuard
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                &gt; scikit-learn email threat classifier
              </div>
            </div>
          </div>
          <Badge variant="outline" className="hidden sm:inline-flex gap-1.5 border-primary/50 text-primary bg-primary/5">
            <Sparkles className="w-3 h-3" />
            ACC {(MODEL_METRICS.accuracy * 100).toFixed(1)}%
          </Badge>
        </div>
      </header>

      <main className="container py-10 space-y-12">
        {/* Hero */}
        <section className="text-center max-w-2xl mx-auto">
          <div className="inline-block px-3 py-1 mb-4 text-[10px] tracking-[0.3em] uppercase border border-accent/40 text-accent bg-accent/5 rounded">
            // SYSTEM ONLINE
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight uppercase">
            <span className="text-foreground">Detect</span>{" "}
            <span className="text-primary [filter:drop-shadow(0_0_12px_hsl(var(--primary)/0.7))]">
              Phishing
            </span>{" "}
            <span className="text-foreground">Emails</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-base">
            Paste any email below. The neural classifier analyses URLs, keywords
            and writing patterns to flag it as{" "}
            <span className="text-danger font-semibold">[PHISHING]</span> or{" "}
            <span className="text-safe font-semibold">[SAFE]</span>.
          </p>
        </section>

        {/* Detector */}
        <section className="grid lg:grid-cols-5 gap-6">
          <Card className="lg:col-span-3 p-6 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                Email content
              </h2>
              <div className="flex flex-wrap gap-1.5 justify-end">
                {SAMPLES.map((s) => (
                  <Button
                    key={s.label}
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => setText(s.text)}
                  >
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 5000))}
              placeholder="Paste the email body here…"
              className="min-h-[280px] font-mono text-sm resize-y"
            />
            <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
              <span>{text.length} / 5000 chars</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setText("")}
                disabled={!text}
              >
                Clear
              </Button>
            </div>
          </Card>

          <div className="lg:col-span-2">
            {result ? (
              <ResultPanel result={result} />
            ) : (
              <Card className="p-8 h-full grid place-items-center text-center shadow-card border-dashed">
                <div>
                  <Shield className="w-10 h-10 mx-auto text-muted-foreground/50" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    Paste an email or pick a sample to see the analysis.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </section>

        {/* Model card */}
        <section className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-primary" />
              <h2 className="font-semibold">Confusion matrix (test set)</h2>
            </div>
            <div className="overflow-x-auto">
              <ConfusionMatrix
                matrix={MODEL_METRICS.confusionMatrix}
                labels={MODEL_METRICS.labels}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Evaluated on {MODEL_METRICS.testSize} held-out emails
              ({MODEL_METRICS.trainSize} training). Diagonal = correct
              predictions.
            </p>
          </Card>

          <Card className="p-6 shadow-card">
            <h2 className="font-semibold mb-4">About the model</h2>
            <dl className="space-y-3 text-sm">
              <Row k="Algorithm" v={MODEL_METRICS.algorithm} />
              <Row k="Accuracy" v={`${(MODEL_METRICS.accuracy * 100).toFixed(2)}%`} />
              <Row k="Training set" v={`${MODEL_METRICS.trainSize} emails`} />
              <Row k="Test set" v={`${MODEL_METRICS.testSize} emails`} />
              <Row k="Library" v="scikit-learn 1.8" />
            </dl>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              The browser uses an in-page port of the trained logistic-regression
              decision function (URL features + weighted keyword scoring) so
              detection runs instantly with no server round-trip. The full
              Python training script, joblib model, dataset, and confusion-matrix
              image are available as downloadable artifacts.
            </p>
          </Card>
        </section>

        <footer className="text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground py-6 border-t border-primary/20">
          // BUILT WITH REACT + SCIKIT-LEARN · EDUCATIONAL USE ONLY //
        </footer>
      </main>
    </div>
  );
};

const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="flex justify-between gap-4 border-b border-border/50 pb-2 last:border-0">
    <dt className="text-muted-foreground">{k}</dt>
    <dd className="font-medium text-right">{v}</dd>
  </div>
);

export default Index;
