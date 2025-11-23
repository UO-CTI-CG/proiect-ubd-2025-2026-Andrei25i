const BackIcon = ({ className, size = 24, props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 14 23"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M11.25 22.5L0 11.25L11.25 0L13.875 2.625L5.25 11.25L13.875 19.875L11.25 22.5Z" />
  </svg>
);
export default BackIcon;
