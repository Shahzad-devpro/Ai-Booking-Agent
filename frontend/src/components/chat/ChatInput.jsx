import { Send } from "lucide-react";

const ChatInput = ({
    value,
    onChange,
    onSend,
    disabled = false
}) => {
    const handleSubmit = (event) => {
        event.preventDefault();

        if (
            disabled ||
            !value.trim()
        ) {
            return;
        }

        onSend();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="border-t border-slate-200 bg-white p-4"
        >
            <div className="mx-auto flex max-w-4xl items-end gap-3">
                {/* Input */}
                <div className="flex-1">
                    <textarea
                        value={value}
                        onChange={(event) =>
                            onChange(event.target.value)
                        }
                        placeholder="Describe what you need help with..."
                        rows={1}
                        disabled={disabled}
                        className="min-h-12 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                </div>

                {/* Send Button */}
                <button
                    type="submit"
                    disabled={
                        disabled ||
                        !value.trim()
                    }
                    aria-label="Send message"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white transition hover:bg-sky-600 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                >
                    <Send size={18} />
                </button>
            </div>

            <p className="mx-auto mt-2 max-w-4xl text-center text-[11px] text-slate-400">
                CoolAir AI can help qualify your request and schedule a service appointment.
            </p>
        </form>
    );
};

export default ChatInput;