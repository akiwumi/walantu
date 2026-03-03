-- WALANTU Trade Services Database Schema

SET FOREIGN_KEY_CHECKS=0;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    national_id VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tradespeople Table
CREATE TABLE IF NOT EXISTS tradespeople (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    service_category ENUM('Carpenter', 'Plumber', 'Electrician', 'Gardener', 'Car mechanic', 'Air conditioner electrician', 'Labourer') NOT NULL,
    experience_years INT DEFAULT 0,
    hourly_rate DECIMAL(10,2) DEFAULT 0,
    monthly_salary DECIMAL(10,2) DEFAULT 0,
    bonus_rate DECIMAL(5,2) DEFAULT 0,
    total_jobs_completed INT DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_earnings DECIMAL(12,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    join_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    service_category ENUM('Carpenter', 'Plumber', 'Electrician', 'Gardener', 'Car mechanic', 'Air conditioner electrician', 'Labourer') NOT NULL,
    status ENUM('assessment_scheduled', 'assessment_completed', 'quote_provided', 'in_progress', 'completed', 'cancelled') DEFAULT 'assessment_scheduled',
    problem_description TEXT,
    address TEXT,
    ghanapostgps_code VARCHAR(50),
    preferred_date DATE,
    preferred_time TIME,
    assessment_fee DECIMAL(10,2) DEFAULT 50.00,
    total_quote DECIMAL(10,2) DEFAULT 0,
    insurance_months INT DEFAULT 3,
    insurance_cost DECIMAL(10,2) DEFAULT 0,
    assigned_tradesperson_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (assigned_tradesperson_id) REFERENCES tradespeople(id)
);

-- Job Assessments Table
CREATE TABLE IF NOT EXISTS job_assessments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT NOT NULL,
    assessed_by INT NOT NULL,
    estimated_hours DECIMAL(5,2),
    estimated_cost DECIMAL(10,2),
    assessment_notes TEXT,
    recommended_parts TEXT,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (assessed_by) REFERENCES tradespeople(id)
);

-- Parts and Materials Table
CREATE TABLE IF NOT EXISTS job_parts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT NOT NULL,
    part_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    supplier VARCHAR(255),
    total_cost DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_cost) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT NOT NULL,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('momo', 'card') NOT NULL,
    mobile_network VARCHAR(50),
    mobile_number VARCHAR(20),
    card_last_four VARCHAR(4),
    status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
    vat_amount DECIMAL(10,2) DEFAULT 0,
    service_tax DECIMAL(10,2) DEFAULT 0,
    total_tax DECIMAL(10,2) GENERATED ALWAYS AS (vat_amount + service_tax) STORED,
    net_amount DECIMAL(10,2) GENERATED ALWAYS AS (amount - vat_amount - service_tax) STORED,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

-- Customer Ratings Table
CREATE TABLE IF NOT EXISTS customer_ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT NOT NULL,
    tradesperson_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    would_recommend BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (tradesperson_id) REFERENCES tradespeople(id)
);

-- Job Timeline Table
CREATE TABLE IF NOT EXISTS job_timeline (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    performed_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (performed_by) REFERENCES tradespeople(id)
);

-- Worker Performance Table
CREATE TABLE IF NOT EXISTS worker_performance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tradesperson_id INT NOT NULL,
    month_year DATE NOT NULL,
    jobs_completed INT DEFAULT 0,
    total_earnings DECIMAL(12,2) DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    bonus_earned DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tradesperson_id) REFERENCES tradespeople(id)
);

-- Insurance Claims Table
CREATE TABLE IF NOT EXISTS insurance_claims (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT NOT NULL,
    claim_type ENUM('workmanship', 'parts', 'both') NOT NULL,
    claim_description TEXT NOT NULL,
    claim_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'paid') DEFAULT 'pending',
    filed_date DATE NOT NULL,
    resolved_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

-- Financial Summary Table
CREATE TABLE IF NOT EXISTS financial_summary (
    id INT PRIMARY KEY AUTO_INCREMENT,
    summary_date DATE NOT NULL,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    total_vat DECIMAL(12,2) DEFAULT 0,
    total_service_tax DECIMAL(12,2) DEFAULT 0,
    total_insurance_income DECIMAL(12,2) DEFAULT 0,
    total_payouts DECIMAL(12,2) DEFAULT 0,
    net_profit DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SET FOREIGN_KEY_CHECKS=1;

-- Insert sample data
INSERT INTO tradespeople (name, email, phone, service_category, experience_years, hourly_rate, monthly_salary, bonus_rate, join_date) VALUES
('Kwame Asante', 'kwame@walantu.com', '+233241111111', 'Plumber', 5, 25.00, 1200.00, 5.00, '2023-01-15'),
('Ama Mensah', 'ama@walantu.com', '+233242222222', 'Electrician', 3, 30.00, 1400.00, 7.00, '2023-03-20'),
('Kofi Appiah', 'kofi@walantu.com', '+233243333333', 'Carpenter', 7, 28.00, 1300.00, 6.00, '2023-02-10'),
('Esi Boateng', 'esi@walantu.com', '+233244444444', 'Gardener', 2, 20.00, 900.00, 4.00, '2023-04-05'),
('Yaw Osei', 'yaw@walantu.com', '+233245555555', 'Car mechanic', 6, 35.00, 1600.00, 8.00, '2023-01-25'),
('Akua Asare', 'akua@walantu.com', '+233246666666', 'Air conditioner electrician', 4, 32.00, 1500.00, 7.00, '2023-03-15'),
('Kwabena Darko', 'kwabena@walantu.com', '+233247777777', 'Labourer', 1, 18.00, 800.00, 3.00, '2023-05-01');