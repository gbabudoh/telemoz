"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Video, Phone, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface CallSchedulerProps {
  proId: string;
  onScheduled?: () => void;
}

export default function CallScheduler({ proId, onScheduled }: CallSchedulerProps) {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [topic, setTopic] = useState("");
  const [callType, setCallType] = useState<"video" | "audio">("video");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const times = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

  const handleSchedule = async () => {
    if (!selectedDay) return;
    
    setIsSubmitting(true);
    try {
      const [hours, minutes] = selectedTime.split(":");
      const scheduledAt = new Date(selectedDay);
      scheduledAt.setHours(parseInt(hours), parseInt(minutes));

      const res = await fetch("/api/messaging/livekit/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proId,
          scheduledAt: scheduledAt.toISOString(),
          topic,
          callType,
          duration: 30,
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        onScheduled?.();
      }
    } catch (error) {
      console.error("Schedule failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-emerald-50/50 rounded-3xl border border-emerald-100">
        <div className="h-16 w-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-4 shadow-xl shadow-emerald-500/20">
          <Check className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">Meeting Scheduled!</h3>
        <p className="text-gray-500 font-medium mb-6">A calendar invite has been sent to the professional.</p>
        <Button onClick={() => setIsSuccess(false)} variant="secondary">Schedule Another</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-2">
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-[#0a9396]" />
            Select Date
          </h3>
          <DayPicker
            mode="single"
            selected={selectedDay}
            onSelect={setSelectedDay}
            className="mx-auto"
            modifiers={{
                disabled: { before: new Date() }
            }}
          />
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#0a9396]" />
            Available Slots
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {times.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedTime === time 
                    ? "bg-[#0a9396] text-white shadow-md scale-105" 
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col h-full">
          <h3 className="text-lg font-black text-gray-900 mb-6">Meeting Details</h3>
          
          <div className="space-y-4 flex-1">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Meeting Topic</label>
              <Input 
                placeholder="e.g. Campaign Strategy Sync" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="h-14 bg-gray-50 border-gray-100 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Call Type</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setCallType("video")}
                  className={`flex-1 flex items-center justify-center gap-2 h-14 rounded-xl border transition-all ${
                    callType === "video" 
                      ? "bg-[#0a9396]/5 border-[#0a9396] text-[#0a9396]" 
                      : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                  }`}
                >
                  <Video className="h-5 w-5" />
                  <span className="text-sm font-black">Video Call</span>
                </button>
                <button
                  onClick={() => setCallType("audio")}
                  className={`flex-1 flex items-center justify-center gap-2 h-14 rounded-xl border transition-all ${
                    callType === "audio" 
                      ? "bg-[#0a9396]/5 border-[#0a9396] text-[#0a9396]" 
                      : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                  }`}
                >
                  <Phone className="h-5 w-5" />
                  <span className="text-sm font-black">Voice Only</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-50 mt-6">
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Confirmation</p>
               <p className="text-sm font-black text-gray-900">
                {selectedDay ? format(selectedDay, "EEEE, MMM do") : "Select a date"} at {selectedTime}
               </p>
            </div>
            <button
              disabled={isSubmitting || !selectedDay}
              onClick={handleSchedule}
              className="w-full h-16 bg-[#0a9396] hover:bg-[#087579] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#0a9396]/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : "Confirm & Schedule Call"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
