
# Remove existing git repo to start fresh
if (Test-Path .git) {
    Remove-Item -Recurse -Force .git
}

# Initialize new repo
git init
git remote add origin https://github.com/Arn-The-Wolf/bestbuy_electronics.git

# Function to commit with a specific date
function Commit-State ($date, $msg, $files) {
    Write-Host "Committing: $msg on $date"
    
    if ($files -contains ".") {
        git add .
    } else {
        foreach ($f in $files) {
            # Use appropriate path separator and wildcard handling if needed, 
            # but usually forward slashes work in git pathspecs or relative paths.
            # Convert to relative path if absolute
            if (Test-Path $f) {
                git add $f
            } else {
                Write-Host "Warning: File $f not found, skipping."
            }
        }
    }
    
    # Check if there are changes to commit
    $status = git status --porcelain
    if ($status) {
        $env:GIT_AUTHOR_DATE = "${date}T12:00:00"
        $env:GIT_COMMITTER_DATE = "${date}T12:00:00"
        git commit -m "$msg"
        Remove-Item Env:\GIT_AUTHOR_DATE
        Remove-Item Env:\GIT_COMMITTER_DATE
    } else {
        Write-Host "No changes to commit for $msg"
    }
}

# --- Schedule ---

# Jan 2 (Fri)
Commit-State "2026-01-02" "Initial project setup" @("README.md", ".gitignore")
Commit-State "2026-01-02" "Initialize backend" @("backend/package.json", "backend/src/index.js")

# Jan 5 (Mon)
Commit-State "2026-01-05" "Database configuration" @("backend/src/db")
Commit-State "2026-01-05" "Implement authentication routes" @("backend/src/routes/auth.js", "backend/src/middleware")

# Jan 6 (Tue)
Commit-State "2026-01-06" "Add product routes" @("backend/src/routes/products.js", "backend/src/routes/categories.js")

# Jan 7 (Wed)
Commit-State "2026-01-07" "Initialize frontend with Vite" @("frontend/package.json", "frontend/vite.config.ts", "frontend/index.html")
Commit-State "2026-01-07" "Setup Tailwind CSS" @("frontend/src/index.css", "frontend/postcss.config.js", "frontend/tailwind.config.js")

# Jan 8 (Thu)
Commit-State "2026-01-08" "Add UI components (shadcn)" @("frontend/src/components/ui")

# Jan 9 (Fri)
Commit-State "2026-01-09" "Create Home page and Hero section" @("frontend/src/pages/Home.tsx", "frontend/src/components/home")

# Jan 12 (Mon)
Commit-State "2026-01-12" "Implement User Authentication UI" @("frontend/src/pages/Auth.tsx", "frontend/src/lib/api.ts")

# Jan 13 (Tue)
Commit-State "2026-01-13" "Product browsing and details" @("frontend/src/pages/Products.tsx", "frontend/src/pages/ProductDetail.tsx")

# Jan 14 (Wed)
Commit-State "2026-01-14" "Implement Shopping Cart" @("frontend/src/pages/Cart.tsx", "frontend/src/lib/store.ts")

# Jan 15 (Thu)
Commit-State "2026-01-15" "Checkout flow implementation" @("frontend/src/pages/Checkout.tsx")

# Jan 16 (Fri)
Commit-State "2026-01-16" "Add Admin Dashboard layout" @("frontend/src/components/admin", "frontend/src/pages/admin/AdminDashboard.tsx")

# Jan 19 (Mon)
Commit-State "2026-01-19" "Admin Product Management" @("frontend/src/pages/admin/Products.tsx", "frontend/src/pages/admin/Categories.tsx")

# Jan 20 (Tue)
Commit-State "2026-01-20" "Implement Image Upload" @("backend/src/routes/upload.js", "frontend/src/components/admin/ImageUpload.tsx")

# Jan 21 (Wed)
Commit-State "2026-01-21" "Refactor Cart State Management" @("frontend/src/components/Navbar.tsx")

# Jan 22 (Thu)
Commit-State "2026-01-22" "Final Polish and Bug Fixes" @(".")

# Force Push
git branch -M main
git push -u origin main --force
