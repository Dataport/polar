array=( afm snowbox )
for i in "${array[@]}"
do
  echo "Building $i docs ..."
	npm run docs:$i
  mkdir --parents ./pages_output/docs/$i
  mv ./packages/clients/$i/docs/* ./pages_output/docs/$i
done
echo "All docs built."
cd ./pages
npx vite build
sed -i 's/<link/<link data-polar="true"/g' ../pages_output/index.html
echo "GitHub page built."