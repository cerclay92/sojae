module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    "react/no-unescaped-entities": "off",
    "react-hooks/rules-of-hooks": "off",
    "@next/next/no-html-link-for-pages": "off",
    "prefer-const": "off",
    "@next/next/no-img-element": "off"
  },
  // 완전히 검사를 비활성화
  ignorePatterns: ["**/*"]
}; 