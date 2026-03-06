module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/**/index.js", // Opcional: ignorar el punto de entrada
  ],
  coverageDirectory: "coverage",
  // El reportero 'html' es el que genera la web con líneas rojas
  coverageReporters: ["text", "lcov", "html"],
};