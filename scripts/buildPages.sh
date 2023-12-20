array=( afm meldemichel snowbox )
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
echo "GitHub page built."