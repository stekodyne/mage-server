angular
  .module('mage')
  .directive('fileUpload', fileUpload);

function fileUpload() {
  var directive = {
    restrict: "A",
    templateUrl: '/app/file-upload/file-upload.directive.html',
    scope: {
      type: '@',
      url: '@',
      allowUpload: '=',
      preview: '=',
      uploadId: '=',
      uploadFileFormName: '=',
      defaultImageUrl: '='
    },
    controller: FileUploadController
  };

  return directive;
}

FileUploadController.$inject = ['$scope', '$element'];

function FileUploadController($scope, $element) {
  if (!$scope.type) $scope.type = 'detail';

  $scope.uploadImageMissing = true;
  $element.find("img").error(function() {
    $scope.uploadImageMissing = true;
    $scope.$apply();
    if (!$scope.defaultImageUrl) return;
    $(this).attr('src', $scope.defaultImageUrl);
  }).load(function() {
    $scope.uploadImageMissing = false;
  });

  $element.find('.file-custom').attr('data-filename', 'Choose a file...');

  $element.find(':file').bind('change', function() {
    $scope.file = this.files[0];

    var element = $($element.find('.upload-file')[0]);
    if ($scope.preview) {
      previewFile($scope.file, element);
    }
    $scope.$apply(function() {
      $scope.$emit('uploadFile', $scope.uploadId);
    });
    upload();
  });

  $scope.$watch('url', function(url) {
    if (!url) return;

    $scope.uploadImageMissing = false;
    $element.find('.preview').html(['<img class="preview-image" src="',$scope.url,'"/>'].join(''));
  });

  var previewFile = function(file, element) {
    if (window.FileReader) {
      var reader = new FileReader();

      reader.onload = (function(theFile) {
        return function(e) {
          $scope.uploadImageMissing = false;
          $scope.$apply();
          element.find('.preview').html(['<img class="preview-image" src="', e.target.result,'" title="', theFile.name, '"/>'].join(''));
        };
      })(file);

      reader.readAsDataURL(file);
    }
  };

  var uploadProgress = function(e) {
    if(e.lengthComputable){
      $scope.$apply(function() {
        $scope.uploading = true;
        $scope.uploadProgress = (e.loaded/e.total) * 100;
      });
    }
  };

  var uploadComplete = function(response) {
    $scope.$apply(function() {
      $scope.file = null;
      $scope.uploading = false;
      $scope.$emit('uploadComplete', $scope.url, response, $scope.uploadId);
    });
  };

  var uploadFailed = function(response) {
    $scope.$apply(function() {
      $scope.file = null;
      $scope.uploading = false;
      $scope.$emit('uploadFailed', $scope.url, response, $scope.uploadId);
    });
  };

  var upload = function() {
    if (!$scope.url || !$scope.allowUpload || !$scope.file) return;

    var formData = new FormData();
    formData.append($scope.uploadFileFormName, $scope.file);

    $.ajax({
      url: $scope.url,
      type: 'POST',
      xhr: function() {
        var myXhr = $.ajaxSettings.xhr();
        if (myXhr.upload) {
          myXhr.upload.addEventListener('progress',uploadProgress, false);
        }
        return myXhr;
      },
      success: uploadComplete,
      error: uploadFailed,
      data: formData,
      cache: false,
      contentType: false,
      processData: false
    });
  };

  $scope.$watch('allowUpload', function(newValue, old) {
    if (newValue && old !== newValue) {
      upload();
    }
  });
}
