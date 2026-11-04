#!/usr/bin/env bash
# Host the static khushmit site on an S3 website.
#   ./scripts/deploy-s3.sh          create bucket (if needed) + upload
#   ./scripts/deploy-s3.sh destroy  empty + delete the bucket
# Needs: aws cli configured (aws configure).
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

REGION="${AWS_REGION:-us-east-1}"
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
BUCKET="${BUCKET:-khushmit-$ACCOUNT}"   # globally-unique default

if [ "${1:-}" = "destroy" ]; then
  aws s3 rb "s3://$BUCKET" --force
  echo "Deleted s3://$BUCKET"
  exit 0
fi

# 1. Create the bucket + static hosting the first time
if ! aws s3api head-bucket --bucket "$BUCKET" 2>/dev/null; then
  echo "Creating s3://$BUCKET"
  if [ "$REGION" = "us-east-1" ]; then
    aws s3api create-bucket --bucket "$BUCKET" --region "$REGION"
  else
    aws s3api create-bucket --bucket "$BUCKET" --region "$REGION" \
      --create-bucket-configuration "LocationConstraint=$REGION"
  fi
  aws s3 website "s3://$BUCKET" --index-document index.html --error-document index.html
  aws s3api put-public-access-block --bucket "$BUCKET" \
    --public-access-block-configuration BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false
  aws s3api put-bucket-policy --bucket "$BUCKET" --policy "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Sid\":\"PublicRead\",\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::$BUCKET/*\"}]}"
fi

# 2. Upload the static site from the repository root.
aws s3 sync "$ROOT_DIR" "s3://$BUCKET" --delete \
  --exclude ".git/*" \
  --exclude ".github/*" \
  --exclude "scripts/*" \
  --exclude "README.md" \
  --exclude ".nojekyll"

echo
echo "Live: http://$BUCKET.s3-website-$REGION.amazonaws.com"
echo "Tear down: ./scripts/deploy-s3.sh destroy"
