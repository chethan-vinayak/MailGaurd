interface Props {
  matrix: number[][];
  labels: string[];
}

export const ConfusionMatrix = ({ matrix, labels }: Props) => {
  const max = Math.max(...matrix.flat());
  const total = matrix.flat().reduce((a, b) => a + b, 0);

  return (
    <div className="inline-block">
      <div className="flex">
        <div className="w-24" />
        <div className="flex-1 text-center text-xs font-medium text-muted-foreground pb-2">
          Predicted
        </div>
      </div>
      <div className="flex">
        <div className="w-6 flex items-center justify-center">
          <span className="text-xs font-medium text-muted-foreground -rotate-90 whitespace-nowrap">
            Actual
          </span>
        </div>
        <div>
          <div className="flex">
            <div className="w-24" />
            {labels.map((l) => (
              <div key={l} className="w-24 text-center text-xs font-medium pb-1">
                {l}
              </div>
            ))}
          </div>
          {matrix.map((row, i) => (
            <div key={i} className="flex items-center">
              <div className="w-24 pr-2 text-right text-xs font-medium">
                {labels[i]}
              </div>
              {row.map((val, j) => {
                const intensity = max ? val / max : 0;
                const correct = i === j;
                return (
                  <div
                    key={j}
                    className="w-24 h-24 flex flex-col items-center justify-center border border-border/40 rounded-md m-0.5"
                    style={{
                      backgroundColor: correct
                        ? `hsl(var(--safe) / ${0.15 + intensity * 0.55})`
                        : `hsl(var(--danger) / ${0.15 + intensity * 0.55})`,
                    }}
                  >
                    <span className="text-2xl font-bold tabular-nums">{val}</span>
                    <span className="text-[10px] text-muted-foreground mt-1">
                      {((val / total) * 100).toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
