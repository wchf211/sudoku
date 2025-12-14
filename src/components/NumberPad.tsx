interface NumberPadProps {
  counts: number[];
  onInput: (value: number) => void;
  onClear: () => void;
  onHint: () => void;
  onTogglePencil: () => void;
  disabled: boolean;
  hintDisabled: boolean;
  remainingHints: number;
  isPencilMode: boolean;
}

const topDigits = [1, 2, 3, 4, 5];
const bottomDigits = [6, 7, 8, 9];

const NumberPad = ({
  counts,
  onInput,
  onClear,
  onHint,
  onTogglePencil,
  disabled,
  hintDisabled,
  remainingHints,
  isPencilMode,
}: NumberPadProps) => (
  <div className={`number-pad ${isPencilMode ? 'number-pad-pencil' : ''}`}>
    {topDigits.map((digit, index) => {
      const isUsedUp = counts[digit] >= 9;
      return (
        <button
          key={digit}
          type="button"
          className={`number-button ${isPencilMode ? 'number-button-pencil' : ''}`}
          style={{ gridArea: `d${index + 1}` }}
          onClick={() => onInput(digit)}
          disabled={disabled || isUsedUp}
        >
          {digit}
        </button>
      );
    })}
    <button
      type="button"
      className={`number-button icon-button ${isPencilMode ? 'pencil-active' : ''}`}
      style={{ gridArea: 'pencil' }}
      onClick={onTogglePencil}
      aria-label="Toggle pencil mode"
    >
      {isPencilMode ? '🖊️' : '✏️'}
    </button>
    {bottomDigits.map((digit, index) => {
      const isUsedUp = counts[digit] >= 9;
      return (
        <button
          key={digit}
          type="button"
          className={`number-button ${isPencilMode ? 'number-button-pencil' : ''}`}
          style={{ gridArea: `d${index + 6}` }}
          onClick={() => onInput(digit)}
          disabled={disabled || isUsedUp}
        >
          {digit}
        </button>
      );
    })}
    <button
      type="button"
      className="number-button number-button-clear"
      style={{ gridArea: 'clear' }}
      onClick={onClear}
      disabled={disabled}
    >
      Clear
    </button>
    <button
      type="button"
      className="number-button icon-button"
      style={{ gridArea: 'hint' }}
      onClick={onHint}
      disabled={hintDisabled}
      aria-label="Get a hint"
    >
      💡({remainingHints})
    </button>
  </div>
);

export default NumberPad;
