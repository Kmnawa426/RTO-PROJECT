
 // One form field (label + input).
// name must match your Mongoose field name.
// as: 'input' (default) | 'select' | 'textarea'
// options: ['A', 'B'] or [{ value: 'id', label: 'Name' }]

export default function Field({
  label,
  name,
  as = 'input',
  type = 'text',
  options = [],
  required = true,
  help,
  col = 'col-md-6',
  value,
  defaultValue,
  ...rest
}) {
  const id = 'f-' + name

  const commonProps = {
    id,
    name,
    required,
    ...rest,
  }

  let control

  if (as === 'select') {
    control = (
      <select
        {...commonProps}
        className={`form-select ${rest.className || ''}`}
        {...(value !== undefined
          ? { value: value ?? '' }
          : { defaultValue: defaultValue ?? '' })}
      >
        <option value="" disabled={required}>
          {required ? 'Select…' : 'None'}
        </option>

        {options.map((option) => {
          const item =
            typeof option === 'string'
              ? { value: option, label: option }
              : option

          return (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          )
        })}
      </select>
    )
  } else if (as === 'textarea') {
    control = (
      <textarea
        {...commonProps}
        rows={3}
        className={`form-control ${rest.className || ''}`}
        {...(value !== undefined
          ? { value: value ?? '' }
          : { defaultValue: defaultValue ?? '' })}
      />
    )
  } else {
    control = (
      <input
        {...commonProps}
        type={type}
        className={`form-control ${rest.className || ''}`}
        {...(value !== undefined
          ? { value: value ?? '' }
          : { defaultValue: defaultValue ?? '' })}
      />
    )
  }

  return (
    <div className={col}>
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>

      {control}

      {help && <div className="form-text">{help}</div>}
    </div>
  )
}

// Success / error message under a form.
// result = { ok, message }

export function FormResult({ result, okText }) {
  if (!result) return null

  return result.ok ? (
    <div className="alert alert-success py-2 mt-3 mb-0">
      {okText}
    </div>
  ) : (
    <div className="alert alert-danger py-2 mt-3 mb-0">
      {result.message}
    </div>
  )
}
