Command line instructions

Git global setup
git config --global user.name "liumin"
git config --global user.email "liumin@tmxmall.com"

Create a new repository
git clone ssh://git@gitlab.tmxmall.com:9422/tmxmall_fe/yi-table.git
cd yi-table
touch README.md
git add README.md
git commit -m "add README"
git push -u origin master

Existing folder
cd existing_folder
git init
git remote add origin ssh://git@gitlab.tmxmall.com:9422/tmxmall_fe/yi-table.git
git add .
git commit -m "Initial commit"
git push -u origin master

