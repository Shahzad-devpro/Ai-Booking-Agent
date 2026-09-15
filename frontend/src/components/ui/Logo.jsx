import {
    Snowflake,
    Wind,
} from "lucide-react";

const Logo = ({
    dark = false,
    compact = false,
}) => {
    return (
        <div className="inline-flex items-center gap-2.5">
            {/* Logo Mark */}
            <div
                className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl ${
                    dark
                        ? "bg-white text-sky-600"
                        : "bg-sky-600 text-white"
                } ${
                    compact
                        ? "h-9 w-9"
                        : "h-10 w-10"
                }`}
            >
                <Snowflake
                    size={compact ? 19 : 21}
                    strokeWidth={2.2}
                />

                <Wind
                    size={10}
                    strokeWidth={2.5}
                    className="absolute bottom-1 right-1"
                />
            </div>

            {/* Wordmark */}
            {!compact && (
                <div className="leading-none">
                    <span
                        className={`block text-[17px] font-extrabold tracking-tight ${
                            dark
                                ? "text-white"
                                : "text-slate-950"
                        }`}
                    >
                        CoolAir
                    </span>

                    <span
                        className={`mt-1 block text-[8px] font-bold tracking-[0.2em] ${
                            dark
                                ? "text-slate-400"
                                : "text-slate-400"
                        }`}
                    >
                        HVAC SERVICES
                    </span>
                </div>
            )}
        </div>
    );
};

export default Logo;