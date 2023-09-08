// @ts-nocheck
const quill = new Quill('#editor', { theme: 'snow' });
      document.getElementById('createForm').addEventListener('submit',
        function (event) {
          event.preventDefault(); 
          const editorContent =
            quill.root.innerHTML; document.getElementById('hiddenArea').value =
              editorContent; this.submit();
        });