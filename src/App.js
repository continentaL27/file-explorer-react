import { useState } from "react";
import "./App.css";



const Files = [ {name : "root", type : "folder"},
                { name : "src1 in root", type : "folder" },
                { name : "file1.txt src1 in root", type : "file" },
                { name : "file2.txt src1 in root", type : "file" },
                { name : "src2 in root", type : "folder"},
                { name : "file1.txt src2 in root", type : "file" }];

/*const Files = [ { name : "disk", type : "folder"}, 
  { name : "docs in disk", type : "folder"},
  { name : "contract docs in disk", type : "file"},
  { name : "photo in disk" , type : "folder"},
  { name : "2022 photo in disk", type : "folder"},
  { name : "1.png 2022 photo in disk", type : "file"},
  { name : "2.png 2022 photo in disk", type : "file"},
  { name : "2021 photo in disk", type : "folder"},
  { name : "films in disk", type : "folder"}];
*/
export default function App() {
  return (
    <div className="App">
      <FileExplorer files={Files} />
    </div>
  );
}

function FileExplorer({ files }) {
  const [expanded, setExpanded] = useState(false);
  
  if (Array.isArray(files)) {
    files = arrangeIntoTree(files)[0];
  }
  
  if (files.type === "folder") {
    return (
      <div key={files.name}>
        <span onClick={() => setExpanded(!expanded)}>
         {files.name}
          { 
           expanded ? "📂" : "📁"
          } 
        </span>
        <div
          className="expanded"
          style={{ display: expanded ? "block" : "none" }}
        >
          {files.children.map((file) => {
            if (file.type === "file")
              return <div key={file.name}>{file.name}</div>;
            else if (file.type === "folder")
              return <FileExplorer key={file.name} files={file} />;
          })}
        </div>
      </div>
    );
  } else if (files.type === "file") {
    return <div>{files.name}</div>;
  } else {
    return <p>⚱⚱</p>;
  }
}

function arrangeIntoTree(paths) {
    let tree = [];

    for (var i = 0; i < paths.length; i++) {
        let path = toPath(paths[i].name).split("/");
        let type = paths[i].type ;
        let currentLevel = tree;
        for (let j = 0; j < path.length; j++) {
            let part = path[j];

            let existingPath = findWhere(currentLevel, 'name', part);

            if (existingPath) {
                currentLevel = existingPath.children;
            } else {
              let newPart;
              if (type === "folder") {
                newPart = {
                    name: part,
                    type : type,
                    children: [],
                }
              } else {
                newPart = {
                    name : part,
                    type : type,
                }
              }
              currentLevel.push(newPart);
              currentLevel = type === "folder" ? newPart.children : currentLevel; 
            }
        }
    }
    return tree;

    function findWhere(array, key, value) {
        let t = 0; 
        while (t < array.length && array[t][key] !== value) { t++; }; 

        if (t < array.length) {
            return array[t]
        } else {
            return false;
        }
    }

    function toPath(name) {
      const containsIn = name.includes(" in ");
      if (containsIn) {
        const inIndex = name.indexOf(" in ");
        let str1 = name.substring(0, inIndex);
        let root = name.substring(inIndex + 4);
        let res = str1.split(" ");
        res.push(root);
        return res.reverse().join("/");
      } else {
        return name;
    }
  }

}
