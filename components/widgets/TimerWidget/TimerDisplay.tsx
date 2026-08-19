import { formatDigitalTime } from "@/lib/timer/timerUtils";

type Props = {
  elapsed: number;
};

export default function TimerDisplay({
  elapsed,
}: Props) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center">
      <div className="font-mono text-3xl font-medium tracking-wider">
        {formatDigitalTime(elapsed)}
      </div>
    </div>
  );
}