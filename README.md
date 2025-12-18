# cron-human

Convert cron expressions to human-readable descriptions and vice versa with validation and execution preview

## Features

- Parse standard 5-field cron expressions (minute hour day month weekday)
- Support extended 6-field format with seconds
- Convert cron to natural language (e.g., '0 9 * * 1-5' → 'At 9:00 AM, Monday through Friday')
- Generate cron from natural language input (e.g., 'every weekday at 9am' → '0 9 * * 1-5')
- Validate cron syntax with detailed error messages showing which field is invalid
- Display next 5 execution times with dates and times
- Support special strings (@hourly, @daily, @weekly, @monthly, @yearly)
- Handle ranges (1-5), lists (1,3,5), steps (*/15), and combinations
- Colorized terminal output for better readability
- Pipe support for batch processing multiple expressions
- Interactive mode with prompts for building cron expressions step-by-step

## Installation

```bash
# Clone the repository
git clone https://github.com/KurtWeston/cron-human.git
cd cron-human

# Install dependencies
npm install
```

## Usage

```bash
npm start
```

## Built With

- typescript

## Dependencies

- `commander`
- `chalk`
- `croner`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
