import { useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";
import { Warning } from "@phosphor-icons/react";

export default function TimerComponent({
  expiryTimestamp,
  endTimestamp,
}: {
  expiryTimestamp: Date;
  endTimestamp: Date;
}) {
  const { seconds, minutes, hours, days, isRunning } = useTimer({
    expiryTimestamp,
  });

  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    const now = Date.now();
    if (now < expiryTimestamp.getTime()) {
      setStatus("Starts in");
    } else if (
      now >= expiryTimestamp.getTime() &&
      now < endTimestamp.getTime()
    ) {
      setStatus("Ongoing");
    } else {
      setStatus("Contest ended");
    }
  }, [expiryTimestamp, endTimestamp, isRunning]);

  return (
    <div className="flex items-center">
      <div>
        {status === "Ongoing" && (
          <div className="inline-block w-3 h-3 ml-1 mr-2 bg-red-500 rounded-full animate-pulse"></div>
        )}
        {status === "Contest ended" && (
          <Warning className="mr-1 text-red-500" size={20} />
        )}
      </div>
      <div className="ml-1">
        {status === "Starts in" && (
          <div className="flex gap-1">
            <span className="">Starts in</span>
            {days > 0 && (
              <span>
                {days} {days > 1 ? "Days" : "Day"}
              </span>
            )}
            {hours > 0 && <span>{hours} Hrs</span>}
            {minutes > 0 && <span>{minutes} Mins</span>}
            <span>{seconds} Secs</span>
          </div>
        )}
        {status === "Ongoing" && <span>Ongoing</span>}
        {status === "Contest ended" && (
          <span className="text-red-500 font-[450]">Contest Ended</span>
        )}
      </div>
    </div>
  );
}
