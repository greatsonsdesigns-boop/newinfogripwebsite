# InfoGrip Payment System - Deployment Instructions

## Overview
This document provides step-by-step instructions to deploy the complete InfoGrip payment and invoice system with Razorpay integration.

## Prerequisites
1. Google Workspace account (for Google Sheets, Apps Script, Drive)
2. Razorpay account (Live mode with Key ID and Key Secret)
3. Web hosting for HTML files (GitHub Pages, Netlify, or your own server)
4. Basic knowledge of Google Apps Script and web deployment

## Step 1: Google Sheets Setup

1. Create a new Google Sheet
2. Name it "InfoGrip Payment System"
3. Create three sheets with exact names:
   - `CLIENTS_MASTER`
   - `PAYMENTS_CREATED` 
   - `PAYMENTS_HISTORY`

4. Set up columns for each sheet:

### CLIENTS_MASTER Sheet:
