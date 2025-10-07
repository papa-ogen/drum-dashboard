# Makefile for the Drum Dashboard project

# Use .PHONY to declare targets that are not files.
.PHONY: install clean dev build lint preview start-frontend start-backend all

# The default command, executed when you just run `make`.
# It will install all necessary dependencies.
default: install

# Install all npm dependencies from package.json
install:
	@echo "--> Installing npm dependencies..."
	npm install

# Remove installed dependencies and build artifacts
clean:
	@echo "--> Cleaning project by removing node_modules and dist folder..."
	rm -rf node_modules dist

# A helper target to guide you on how to start the development environment.
dev:
	@echo "--> To start development, please run the following commands in two separate terminals:"
	@echo "    make start-frontend"
	@echo "    make start-backend"
	@echo "    Alternatively, run 'make all' to start both in this terminal."

# Run both frontend and backend servers concurrently.
# The backend server will run in the background.
all:
	@echo "--> Starting backend server in the background and frontend in the foreground..."
	@echo "    Note: To stop the background server, you may need to find its process ID and kill it manually."
	npm run server & npm run dev

# Run the frontend development server (Vite)
start-frontend:
	@echo "--> Starting frontend development server (Vite)..."
	npm run dev

# Run the backend development server (Express)
start-backend:
	@echo "--> Starting backend server (Express)..."
	npm run server

# Create a production-ready build of the frontend application
build:
	@echo "--> Building the application for production..."
	npm run build

# Lint the source code to check for errors
lint:
	@echo "--> Linting source code..."
	npm run lint

# Preview the production build locally after running 'make build'
preview:
	@echo "--> Previewing the production build..."
	npm run preview

